import test from 'node:test';
import assert from 'node:assert/strict';
import { selectOgItem, selectOgFeatured, ogHeadline, ogProteinScore, fitOgText } from '../lib/og/restaurant.ts';
import { getRestaurantData } from '../lib/restaurants.ts';
import { loadOgImage } from '../lib/og/assets.ts';
const item = (id, protein, extra = {}) => ({ id, name: id, image: '', categories: [], servingType: 'entree', defaultOrder: 1, nutrition: { calories: 400, protein, carbs: 20, totalFat: 10 }, ...extra });
test('selects a high-protein default portion, excluding internal and shareable records', () => {
  const items = [item('internal', 200, { sourceOnly: true }), item('party', 150, { servingType: 'shareable' }), item('side', 90, { servingType: 'side' }), item('main', 30), item('variant', 100, { defaultVariantId: 'regular', variants: [{ id: 'regular', nutrition: { calories: 300, protein: 20 } }] })];
  assert.equal(selectOgItem(items).item.id, 'main');
  assert.equal(items[0].id, 'internal');
});
test('handles empty menus, partial data, invalid scores and long labels', () => {
  assert.equal(selectOgItem([]), undefined);
  assert.equal(selectOgItem([item('partial', 10, { nutrition: { protein: 10 } })]).nutrition.calories, undefined);
  assert.equal(ogProteinScore({ protein: 10, calories: 0 }), undefined);
  assert.equal(ogProteinScore({ protein: 30, calories: 300 }), 10);
  assert.equal(fitOgText('a'.repeat(100), 64).length, 64);
});
test('missing and unsupported images use placeholder path', async () => {
  assert.equal(await loadOgImage('/missing-og-photo.png'), undefined);
  assert.equal(await loadOgImage('http://example.com/photo.png'), undefined);
  assert.equal(await loadOgImage('/../package.json'), undefined);
  assert.match(await loadOgImage('/logo.svg'), /^data:image\/png;base64,/);
});

test('standard selection prefers photography and regular menu placement over maximal protein', () => {
  const choices = [item('obscure', 80, { defaultOrder: 99 }), item('regular', 29, { image: '/food.png', defaultOrder: 1 }), item('promotion', 90, { image: '/promo.png', status: 'limited-time' })];
  assert.equal(selectOgItem(choices).item.id, 'regular');
});
test('build-your-own selects a core ingredient and never a preconfigured meal', async () => {
  const restaurant = await getRestaurantData('chipotle');
  const selected = selectOgFeatured(restaurant);
  assert.equal(selected.item.id, 'chipotle-protein-chicken');
  assert.equal(selected.nutrition.protein, 32);
  assert.equal(selected.nutrition.calories, 180);
  assert.equal(ogHeadline(restaurant), 'Find high-protein Chipotle meals');
  assert.equal(selectOgFeatured({ ...restaurant, ingredients: [] }), undefined);
});
test('future builders can name a primary ingredient category explicitly', () => {
  const restaurant = { hasBuildYourOwn: true, builderConfig: { primaryProteinCategory: 'Fillings' }, items: [item('meal', 100)], ingredients: [
    { ...item('tofu', 20), categories: ['Fillings'] },
    { ...item('chicken', 30), categories: ['Fillings'] },
    { ...item('extra', 90), categories: ['Toppings'] },
  ] };
  assert.equal(selectOgFeatured(restaurant).item.id, 'chicken');
});

test('headline format is identical for fixed menus and builders', () => {
  for (const hasBuildYourOwn of [false, true]) {
    assert.equal(ogHeadline({ name: 'Example Grill', hasBuildYourOwn }), 'Find high-protein Example Grill meals');
  }
});
