exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test.js'],
  capabilities: {
    browserName: 'chrome'
  },
  onPrepare: function (){
    global.product = browser.params.productName;
  }
}