'use strict';
const el = id => document.getElementById(id);
const result = (id, value) => { el(id).textContent = value; };
function jsonAction(minify) {
  try { const data = JSON.parse(el('json').value); result('jsonResult', JSON.stringify(data, null, minify ? 0 : 2)); }
  catch (error) { result('jsonResult', `Invalid JSON: ${error.message}`); }
}
el('format').addEventListener('click', () => jsonAction(false));
el('minify').addEventListener('click', () => jsonAction(true));
// UTF-8 safe Base64 conversion, including Unicode and emoji.
function toBase64(value) { const bytes = new TextEncoder().encode(value); let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary); }
function fromBase64(value) { const binary = atob(value.trim()); const bytes = Uint8Array.from(binary, c => c.charCodeAt(0)); return new TextDecoder('utf-8', {fatal:true}).decode(bytes); }
el('encode').addEventListener('click', () => { result('baseResult', toBase64(el('baseInput').value)); });
el('decode').addEventListener('click', () => { try { result('baseResult', fromBase64(el('baseInput').value)); } catch { result('baseResult', 'Invalid Base64 or UTF-8 input.'); } });
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
function secureIndex(max) { const limit = Math.floor(256 / max) * max; const buffer = new Uint8Array(1); do { crypto.getRandomValues(buffer); } while (buffer[0] >= limit); return buffer[0] % max; }
el('generate').addEventListener('click', () => { const length = Number(el('length').value); if (!Number.isInteger(length) || length < 8 || length > 128) { result('passwordResult', 'Enter a whole number from 8 to 128.'); return; } let password = ''; for (let i=0; i<length; i++) password += alphabet[secureIndex(alphabet.length)]; result('passwordResult', password); });
el('textInput').addEventListener('input', () => { const value = el('textInput').value; const words = value.trim() ? value.trim().split(/\s+/u).length : 0; const lines = value ? value.split(/\r\n|\r|\n/u).length : 0; el('stats').textContent = `${[...value].length} characters · ${words} words · ${lines} lines`; });
