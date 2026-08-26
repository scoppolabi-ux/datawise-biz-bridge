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
import {
  BOOKS,
  DOCUMENTS,
  RELEASE_DIR,
  REPO_NAME,
  REPO_OWNER,
  REPO_REF,
  STATIC_ASSETS,
} from './wcm-documentation/config.mjs';
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

async function loadStaticAsset(asset) {
  if (!asset.bootstrap_file || !SHA_RE.test(asset.source_sha ?? '')) {
    throw new Error(`Static asset bootstrap non valido: ${asset.release_path ?? asset.bootstrap_file}`);
  }
  const data = await readFile(path.join(BOOTSTRAP_DIR, asset.bootstrap_file));
  if (!data.length) throw new Error(`Static asset vuoto: ${asset.bootstrap_file}`);
  return data;
}

const releaseRelativeDir = (doc) => (doc.release_subdir ?? '').replace(/^\/+|\/+$/g, '');

async function main() {
  const releasedAt = new Date().toISOString();
  const outDir = path.resolve(RELEASE_DIR);
  const entries = [];
  const writes = [];
  const base = RELEASE_DIR.replace(/^public\/?/, '');

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
    const subdir = releaseRelativeDir(doc);
    const fileBase = subdir ? path.join(outDir, subdir) : outDir;
    const publicBase = subdir ? `${base}/${subdir}` : base;

    writes.push(
      [path.join(fileBase, `${doc.document_id}.md`), markdown],
      [path.join(fileBase, `${doc.document_id}.docx`), docxBuffer],
      [path.join(fileBase, `${doc.document_id}.pdf`), pdfBuffer],
    );

    entries.push({
      document_id: doc.document_id,
      document_kind: doc.document_kind ?? 'manual',
      book_id: doc.book_id ?? null,
      chapter_number: Number.isInteger(doc.chapter_number) ? doc.chapter_number : null,
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
      markdown_path: `${publicBase}/${doc.document_id}.md`,
      docx_path: `${publicBase}/${doc.document_id}.docx`,
      pdf_path: `${publicBase}/${doc.document_id}.pdf`,
      download_filename_docx: `${doc.download_basename}.docx`,
      download_filename_pdf: `${doc.download_basename}.pdf`,
      qa_status,
      visual_qa_status: doc.visual_qa_status ?? 'PENDING',
      docx_page_count: Number.isInteger(doc.docx_page_count) ? doc.docx_page_count : null,
      pdf_page_count: Number.isInteger(doc.pdf_page_count) ? doc.pdf_page_count : null,
    });
    process.stdout.write(`ok (${sha.slice(0, 7)}, docx ${docxBuffer.length}B, pdf ${pdfBuffer.length}B)\n`);
  }

  for (const asset of STATIC_ASSETS ?? []) {
    process.stdout.write(`→ asset ${asset.release_path} … `);
    const data = await loadStaticAsset(asset);
    writes.push([path.join(outDir, asset.release_path), data]);
    process.stdout.write(`ok (${asset.source_sha.slice(0, 7)}, ${data.length}B)\n`);
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  for (const [file, data] of writes) {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, data);
  }
  await writeFile(
    path.join(outDir, 'manifest.json'),
    `${JSON.stringify(
      {
        manifest_version: '1.1',
        release_mode: 'BOOTSTRAP_AUTHORIZED_SNAPSHOT',
        source_of_truth: `https://github.com/${REPO_OWNER}/${REPO_NAME} (${REPO_REF})`,
        generated_at: releasedAt,
        books: BOOKS ?? [],
        static_assets: (STATIC_ASSETS ?? []).map((asset) => ({
          release_path: `${base}/${asset.release_path}`,
          source_path: asset.source_path,
          source_sha: asset.source_sha,
        })),
        documents: entries,
      },
      null,
      2,
    )}\n`,
  );

  const files = (await readdir(outDir, { recursive: true })).sort();
  console.log(`\nRelease directory: ${RELEASE_DIR}`);
  console.log(files.map((f) => `  · ${f}`).join('\n'));
  console.log(`\n${entries.length} documenti · ${BOOKS?.length ?? 0} libri · QA: ${entries.map((e) => e.qa_status).join(', ')}`);
}

main().catch((error) => {
  console.error(`\n✖ WCM documentation BOOTSTRAP release FALLITA: ${error.message}`);
  process.exit(1);
});
