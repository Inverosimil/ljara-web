import test from 'node:test';
import assert from 'node:assert/strict';
import { contenido, categoriaEtiqueta } from '../src/lib/formato.ts';
import { textoConfirmado } from '../src/lib/contenido-publico.ts';

test('preserva la precisión de los contenidos cargados desde gestión', () => {
  assert.equal(contenido(1250), '1,25 L');
  assert.equal(contenido(1500), '1,5 L');
  assert.equal(contenido(1000), '1 L');
  assert.equal(contenido(355), '355 ml');
  assert.equal(contenido(null), '—');
  assert.equal(contenido(0), '—');
});
test('no publica datos incompletos del levantamiento', () => {
  assert.equal(textoConfirmado('[año]'), null);
  assert.equal(textoConfirmado('[Calle Número], Pudahuel'), null);
  assert.equal(textoConfirmado(''), null);
  assert.equal(textoConfirmado(null), null);
  assert.equal(textoConfirmado(' Pudahuel '), 'Pudahuel');
});
test('el respaldo de categoría es legible y admite nuevas categorías', () => {
  assert.equal(categoriaEtiqueta('coctel'), 'Cócteles');
  assert.equal(categoriaEtiqueta('nueva-categoria'), 'nueva categoria');
});
