

describe('Amazon test', function () {

  var actualPrice;
  var subtotalPrice;
  var maxItemNumber;

  browser.ignoreSynchronization = true;

  it('go to Amazon page', function () {
    browser.get('https://www.amazon.com');
    return browser.wait(function () {
      return browser.executeScript('return document.readyState==="complete"').then(function (text) {
        return text === true;              //wait for page to download, could be moved to the helper
      });
    }, 6000);
  });

  it('search for product', function () {
    element(by.id('twotabsearchtextbox')).sendKeys(product).then(function(){
      element(by.xpath('//*[@id="nav-search"]//*[@type="submit"]')).click();
    });
  });

  it('find the most expensive product', function () {
    var priceList = [];
    var maxPrice;
    element.all(by.css('.sx-price.sx-price-large')).map(function(price){
      price.getText().then(function(text){
        priceList.push(Number(text.replace(/\D/g,''))/100);
        maxPrice = Math.max.apply(Math, priceList);
        maxItemNumber = priceList.indexOf(maxPrice);
      });
    });
  });

  it('go to Product page', function () {
    console.log('Most expensive item number on the search result page: '+(maxItemNumber+1));
    element.all(by.css('.sx-price.sx-price-large')).get(maxItemNumber).click();
  });

  it('select smallest size available', function () {
    element(by.id("dropdown_selected_size_name")).click().then(function(){                     // some items don't have size option, it could be handled as well
      element.all(by.xpath('//li[@class ="a-dropdown-item dropdownAvailable" or @class ="a-dropdown-item dropdownSelect"]')).first().click().then(function(){  // additional locator after "or" in case the smallest available size is already preselected

        return browser.wait(function () {
          return element(by.xpath('//*[@id = "add-to-cart-button" and @style = "cursor: not-allowed;"]')).isPresent().then(
            function (present) {
              return !present;
            },                  // after selecting the size it may take some time  for the "add to cart" button to be available, this "wait" function should be moved to the separate helper in real project
            function (error) {
              return false
            });
        }, 6000);


      });
    });
  });

  it('check the actual price', function () {
    element(by.id("priceblock_ourprice")).getText().then(function(text){
      actualPrice = Number(text.replace(/\D/g,''))/100;
    });
  });

  it('add item to the cart', function () {
    console.log('Actual item price: '+actualPrice);
    element(by.id("add-to-cart-button")).click();
  });

  it('proceed to the cart', function () {
    element(by.id("nav-cart")).click();
  });

  it('check the cart subtotal', function () {
    element(by.id("sc-subtotal-amount-activecart")).getText().then(function(text){
      subtotalPrice = Number(text.replace(/\D/g,''))/100;
    });
  });

  it('compare item price and cart subtotal', function () {
    console.log('Subtotal: '+subtotalPrice);
    expect(subtotalPrice).toEqual(actualPrice);
  });

});
