#!/usr/bin/env node
/**
 * WCM Documentation Center — CONTROLLED BOOTSTRAP release.
 *
 * Used when the UI runtime cannot read the private WCM-LAB repository.
 * Exact authorized master snapshots are stored under
 * scripts/wcm-documentation/bootstrap/ together with their GitHub blob SHAs.
 *
 * This does NOT change source-of-truth semantics: WCM-LAB/main remains
 * authoritative and generated DOCX/PDF are derived distribution artifacts.
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { DOCUMENTS, RELEASE_DIR, REPO_NAME, REPO_OWNER, REPO_REF } from './wcm-documentation/config.mjs';
import { extractMetadata, parseMarkdownBlocks } from './wcm-documentation/markdown.mjs';
import { buildDocx } from './wcm-documentation/docx.mjs';
import { buildPdf } from './wcm-documentation/pdf.mjs';
import { qaCheck } from './wcm-release.mjs';

const BOOTSTRAP_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  'wcm-documentation/bootstrap',
);

const SHA_RE = /^[0-9a-f]{40}$/;

async function loadMaster(doc) {
  if (!doc.bootstrap_file || !SHA_RE.test(doc.bootstrap_sha ?? '')) {
    throw new Error(`Bootstrap non configurato per ${doc.document_id} (file o SHA mancante/invalido)`);
  }
  const markdown = await readFile(path.join(BOOTSTRAP_DIR, doc.bootstrap_file), 'utf8');
  if (!markdown.trim()) throw new Error(`Snapshot bootstrap vuoto: ${doc.bootstrap_file}`);
  return { markdown, sha: doc.bootstrap_sha };
}

async function main() {
  const releasedAt = new Date().toISOString();
  const outDir = path.resolve(RELEASE_DIR);
  const entries = [];
  const writes = [];

  for (const doc of DOCUMENTS) {
    process.stdout.write(`→ ${doc.document_id} … `);
    const { markdown, sha } = await loadMaster(doc);
    const blocks = parseMarkdownBlocks(markdown);
    if (blocks.length === 0) throw new Error(`Nessun blocco parsato da ${doc.source_path}`);
    const detected = extractMetadata(markdown);

    const meta = {
      title: doc.title,
      audience: doc.audience,
      version: doc.version,
      master_date: doc.master_date ?? detected.master_date,
      status: doc.status,
      source_path: doc.source_path,
      source_sha: sha,
      source_sha_short: sha.slice(0, 7),
      released_at: releasedAt,
    };

    const docxBuffer = await buildDocx({ blocks, meta });
    const pdfBuffer = await buildPdf({ blocks, meta });
    const qa_status = qaCheck({ markdown, docx: docxBuffer, pdf: pdfBuffer });

    const base = RELEASE_DIR.replace(/^public/, '');
    writes.push(
      [path.join(outDir, `${doc.document_id}.md`), markdown],
      [path.join(outDir, `${doc.document_id}.docx`), docxBuffer],
      [path.join(outDir, `${doc.document_id}.pdf`), pdfBuffer],
    );

    entries.push({
      document_id: doc.document_id,
      scope: doc.scope ?? 'wcm',
      project_id: doc.project_id ?? null,
      project_label: doc.project_label ?? null,
      title: doc.title,
      audience: doc.audience,
      description: doc.description,
      version: meta.version,
      master_date: meta.master_date,
      status: meta.status,
      source_path: doc.source_path,
      source_sha: sha,
      source_sha_short: meta.source_sha_short,
      released_at: releasedAt,
      markdown_path: `${base}/${doc.document_id}.md`,
      docx_path: `${base}/${doc.document_id}.docx`,
      pdf_path: `${base}/${doc.document_id}.pdf`,
      download_filename_docx: `${doc.download_basename}.docx`,
      download_filename_pdf: `${doc.download_basename}.pdf`,
      qa_status,
      visual_qa_status: doc.visual_qa_status ?? 'PENDING',
      docx_page_count: Number.isInteger(doc.docx_page_count) ? doc.docx_page_count : null,
      pdf_page_count: Number.isInteger(doc.pdf_page_count) ? doc.pdf_page_count : null,
    });
    process.stdout.write(`ok (${sha.slice(0, 7)}, docx ${docxBuffer.length}B, pdf ${pdfBuffer.length}B)\n`);
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  for (const [file, data] of writes) await writeFile(file, data);
  await writeFile(
    path.join(outDir, 'manifest.json'),
    `${JSON.stringify(
      {
        manifest_version: '1.0',
        release_mode: 'BOOTSTRAP_AUTHORIZED_SNAPSHOT',
        source_of_truth: `https://github.com/${REPO_OWNER}/${REPO_NAME} (${REPO_REF})`,
        generated_at: releasedAt,
        documents: entries,
      },
      null,
      2,
    )}\n`,
  );

  const files = (await readdir(outDir)).sort();
  console.log(`\nRelease directory: ${RELEASE_DIR}`);
  console.log(files.map((f) => `  · ${f}`).join('\n'));
  console.log(`\n${entries.length} documenti · QA: ${entries.map((e) => e.qa_status).join(', ')}`);
}

main().catch((error) => {
  console.error(`\n✖ WCM documentation BOOTSTRAP release FALLITA: ${error.message}`);
  process.exit(1);
});
