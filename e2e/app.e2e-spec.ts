import { RandomizedNumericGridPage } from './app.po';

describe('randomized-numeric-grid App', function() {
  let page: RandomizedNumericGridPage;

  beforeEach(() => {
    page = new RandomizedNumericGridPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
