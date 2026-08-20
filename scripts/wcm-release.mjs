#!/usr/bin/env node
/**
 * WCM Mission Control — Documentation Center V0.9 release pipeline.
 *
 * Fetches the three documentation masters from GitHub main (source of truth),
 * snapshots the exact markdown, and generates derived DOCX/PDF releases plus a
 * manifest. Must run BEFORE the frontend build.
 *
 * Failure containment: any fetch/generation/QA failure exits non-zero and the
 * release directory is left untouched (artifacts are written atomically at the
 * end, only when every document passed its checks).
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  DOCUMENTS,
  MIN_DOCX_BYTES,
  MIN_PDF_BYTES,
  RELEASE_DIR,
  REPO_NAME,
  REPO_OWNER,
  REPO_REF,
} from './wcm-documentation/config.mjs';
import { extractMetadata, parseMarkdownBlocks } from './wcm-documentation/markdown.mjs';
import { buildDocx } from './wcm-documentation/docx.mjs';
import { buildPdf } from './wcm-documentation/pdf.mjs';

const token = process.env.WCM_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '';

async function fetchMaster(sourcePath) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${sourcePath}?ref=${REPO_REF}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'wcm-documentation-release',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(
      `GitHub Contents API ${response.status} for ${sourcePath}` +
        (response.status === 404 && !token
          ? ' — repository non pubblico: imposta WCM_GITHUB_TOKEN (scope contents:read).'
          : ''),
    );
  }
  const payload = await response.json();
  if (payload.type !== 'file' || typeof payload.content !== 'string') {
    throw new Error(`Contenuto non valido per ${sourcePath}`);
  }
  const markdown = Buffer.from(payload.content, payload.encoding || 'base64').toString('utf8');
  if (!markdown.trim()) throw new Error(`Master vuoto: ${sourcePath}`);
  return { markdown, sha: payload.sha };
}

/** Minimal automatic QA gate. Returns BUILD_PASS or throws. */
export function qaCheck({ markdown, docx, pdf }) {
  if (!markdown || !markdown.trim()) throw new Error('QA: snapshot markdown vuoto');
  if (!docx || docx.length < MIN_DOCX_BYTES) throw new Error('QA: DOCX troppo piccolo o assente');
  if (docx.subarray(0, 2).toString('latin1') !== 'PK') throw new Error('QA: DOCX non è uno zip valido');
  if (!docx.includes(Buffer.from('word/document.xml')))
    throw new Error('QA: DOCX privo di word/document.xml');
  if (!pdf || pdf.length < MIN_PDF_BYTES) throw new Error('QA: PDF troppo piccolo o assente');
  if (pdf.subarray(0, 5).toString('latin1') !== '%PDF-') throw new Error('QA: header PDF mancante');
  return 'BUILD_PASS';
}

async function main() {
  const releasedAt = new Date().toISOString();
  const outDir = path.resolve(RELEASE_DIR);
  const entries = [];
  const writes = [];

  for (const doc of DOCUMENTS) {
    process.stdout.write(`→ ${doc.document_id} … `);
    const { markdown, sha } = await fetchMaster(doc.source_path);
    const blocks = parseMarkdownBlocks(markdown);
    if (blocks.length === 0) throw new Error(`Nessun blocco parsato da ${doc.source_path}`);
    const detected = extractMetadata(markdown);

    const meta = {
      title: doc.title,
      audience: doc.audience,
      version: detected.version ?? doc.version,
      master_date: detected.master_date,
      status: detected.status ?? doc.status,
      source_path: doc.source_path,
      source_sha: sha,
      source_sha_short: sha.slice(0, 7),
      released_at: releasedAt,
    };

    const docxBuffer = await buildDocx({ blocks, meta });
    const pdfBuffer = await buildPdf({ blocks, meta });
    const qa_status = qaCheck({ markdown, docx: docxBuffer, pdf: pdfBuffer });

    const base = `${RELEASE_DIR.replace(/^public/, '')}`;
    writes.push(
      [path.join(outDir, `${doc.document_id}.md`), markdown],
      [path.join(outDir, `${doc.document_id}.docx`), docxBuffer],
      [path.join(outDir, `${doc.document_id}.pdf`), pdfBuffer],
    );

    entries.push({
      document_id: doc.document_id,
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
        manifest_version: '0.9',
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

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`\n✖ WCM documentation release FALLITA: ${error.message}`);
    console.error('Build interrotta: non pubblichiamo una release che sembra corrente ma non lo è.');
    process.exit(1);
  });
}
