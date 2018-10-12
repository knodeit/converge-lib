/**
 * Created by Peter van de Put LPG Labs
 */

'use strict';

var Q = require('q');
var request = require('request');
var xml2js = require('xml2js');

var testURL = 'https://demo.myvirtualmerchant.com/VirtualMerchantDemo/processxml.do';
var productionURL = 'https://www.myvirtualmerchant.com/VirtualMerchant/processxml.do';


function Converge(merchantId, userId, pin, testMode) {
    this.ssl_merchant_id = merchantId;
    this.ssl_user_id = userId;
    this.ssl_pin = pin;
    this.ssl_test_mode = testMode;
}


Converge.prototype.collectPayment = function (firstName, lastName, email, cardNumber, expirationMonth, expirationYear, cvv, amount, invoiceNumber, description) {

    var deferred = Q.defer();
    //build txn node
    var xmlTransaction = '';
    xmlTransaction += 'xmldata=<txn>\n';
    xmlTransaction += '<ssl_add_token>Y</ssl_add_token>\n'
    xmlTransaction += '<ssl_merchant_id>' + this.ssl_merchant_id + '</ssl_merchant_id>\n';
    xmlTransaction += '<ssl_user_id>' + this.ssl_user_id + '</ssl_user_id>\n';
    xmlTransaction += '<ssl_pin>' + this.ssl_pin + '</ssl_pin>\n';
    xmlTransaction += '<ssl_test_mode>' + this.ssl_test_mode + '</ssl_test_mode>\n';
    xmlTransaction += '<ssl_description>' + description + '</ssl_description> \n';
    xmlTransaction += '<ssl_show_form>false</ssl_show_form>'
    xmlTransaction += '<ssl_transaction_type>ccsale</ssl_transaction_type>\n';
    xmlTransaction += '<ssl_card_number>' + cardNumber + '</ssl_card_number>\n';
    xmlTransaction += '<ssl_exp_date>' + expirationMonth + expirationYear + '</ssl_exp_date>\n';
    xmlTransaction += '<ssl_amount>' + amount + '</ssl_amount>\n';
    xmlTransaction += '<ssl_result_format>HTML</ssl_result_format>\n';
    xmlTransaction += '<ssl_cvv2cvc2_indicator>1</ssl_cvv2cvc2_indicator>\n';
    xmlTransaction += '<ssl_cvv2cvc2>' + cvv + '</ssl_cvv2cvc2>\n';
    xmlTransaction += '<ssl_first_name>' + firstName + '</ssl_first_name>\n';
    xmlTransaction += '<ssl_last_name>' + lastName + '</ssl_last_name>\n';
    xmlTransaction += '<ssl_email>' + email + '</ssl_email>\n';
    xmlTransaction += '<ssl_invoice_number>' + invoiceNumber + '</ssl_invoice_number>\n';
    xmlTransaction += '</txn>\n';


    var urlToPost = this.ssl_test_mode ? testURL : productionURL;
    request.post({
        url: urlToPost,
        form: xmlTransaction
    }, function (error, response, body) {
        if (error) {

            return deferred.reject(error);
        }
        //console.log('response',response.body);
        xml2js.parseString(body, function (err, results) {
            if (err) {
                return deferred.reject(err);
            }
            //clean the arrays
            results = cleanXML(results);
            return deferred.resolve(results);
        });
    });
    return deferred.promise;
};
Converge.prototype.collectPaymentwithoutCVV = function (firstName, lastName, email, cardNumber, expirationMonth, expirationYear,  amount, invoiceNumber, description) {

    var deferred = Q.defer();
    //build txn node
    var xmlTransaction = '';
    xmlTransaction += 'xmldata=<txn>\n';
    xmlTransaction += '<ssl_add_token>Y</ssl_add_token>\n'
    xmlTransaction += '<ssl_merchant_id>' + this.ssl_merchant_id + '</ssl_merchant_id>\n';
    xmlTransaction += '<ssl_user_id>' + this.ssl_user_id + '</ssl_user_id>\n';
    xmlTransaction += '<ssl_pin>' + this.ssl_pin + '</ssl_pin>\n';
    xmlTransaction += '<ssl_test_mode>' + this.ssl_test_mode + '</ssl_test_mode>\n';
    xmlTransaction += '<ssl_description>' + description + '</ssl_description> \n';
    xmlTransaction += '<ssl_show_form>false</ssl_show_form>'
    xmlTransaction += '<ssl_transaction_type>ccsale</ssl_transaction_type>\n';
    xmlTransaction += '<ssl_card_number>' + cardNumber + '</ssl_card_number>\n';
    xmlTransaction += '<ssl_exp_date>' + expirationMonth + expirationYear + '</ssl_exp_date>\n';
    xmlTransaction += '<ssl_amount>' + amount + '</ssl_amount>\n';
    xmlTransaction += '<ssl_result_format>HTML</ssl_result_format>\n';
    xmlTransaction += '<ssl_cvv2cvc2_indicator>0</ssl_cvv2cvc2_indicator>\n';

    xmlTransaction += '<ssl_first_name>' + firstName + '</ssl_first_name>\n';
    xmlTransaction += '<ssl_last_name>' + lastName + '</ssl_last_name>\n';
    xmlTransaction += '<ssl_email>' + email + '</ssl_email>\n';
    xmlTransaction += '<ssl_invoice_number>' + invoiceNumber + '</ssl_invoice_number>\n';
    xmlTransaction += '</txn>\n';


    var urlToPost = this.ssl_test_mode ? testURL : productionURL;
    request.post({
        url: urlToPost,
        form: xmlTransaction
    }, function (error, response, body) {
        if (error) {

            return deferred.reject(error);
        }
        //console.log('response',response.body);
        xml2js.parseString(body, function (err, results) {
            if (err) {
                return deferred.reject(err);
            }
            //clean the arrays
            results = cleanXML(results);
            return deferred.resolve(results);
        });
    });
    return deferred.promise;
};

Converge.prototype.generateToken = function (firstName, lastName, email, cardNumber, expirationMonth, expirationYear, cvv) {
    var deferred = Q.defer();
    //build txn node
    var xmlTransaction = '';
    xmlTransaction += 'xmldata=<txn>\n';
    xmlTransaction += '<ssl_add_token>Y</ssl_add_token>\n'
    xmlTransaction += '<ssl_merchant_id>' + this.ssl_merchant_id + '</ssl_merchant_id>\n';
    xmlTransaction += '<ssl_user_id>' + this.ssl_user_id + '</ssl_user_id>\n';
    xmlTransaction += '<ssl_pin>' + this.ssl_pin + '</ssl_pin>\n';
    xmlTransaction += '<ssl_test_mode>' + this.ssl_test_mode + '</ssl_test_mode>\n';
    xmlTransaction += '<ssl_show_form>false</ssl_show_form>'
    xmlTransaction += '<ssl_transaction_type>ccgettoken</ssl_transaction_type>\n';
    xmlTransaction += '<ssl_card_number>' + cardNumber + '</ssl_card_number>\n';
    xmlTransaction += '<ssl_exp_date>' + expirationMonth + expirationYear + '</ssl_exp_date>\n';
    xmlTransaction += '<ssl_result_format>HTML</ssl_result_format>\n';
    xmlTransaction += '<ssl_cvv2cvc2_indicator>1</ssl_cvv2cvc2_indicator>\n';
    xmlTransaction += '<ssl_cvv2cvc2>' + cvv + '</ssl_cvv2cvc2>\n';
    xmlTransaction += '<ssl_first_name>' + firstName + '</ssl_first_name>\n';
    xmlTransaction += '<ssl_last_name>' + lastName + '</ssl_last_name>\n';
    xmlTransaction += '<ssl_email>' + email + '</ssl_email>\n';

    xmlTransaction += '</txn>\n';


    var urlToPost = this.ssl_test_mode ? testURL : productionURL;
    request.post({
        url: urlToPost,
        form: xmlTransaction
    }, function (error, response, body) {
        if (error) {
            return deferred.reject(error);
        }
        xml2js.parseString(body, function (err, results) {
            if (err) {
                return deferred.reject(err);
            }
            //clean the arrays
            results = cleanXML(results);
            return deferred.resolve(results);
        });
    });
    return deferred.promise;
};

Converge.prototype.queryToken = function (token) {
    return new Promise((resolve, reject) => {
        //build txn node
        var xmlTransaction = '';
        xmlTransaction += 'xmldata=<txn>\n';
        xmlTransaction += '<ssl_merchant_id>' + this.ssl_merchant_id + '</ssl_merchant_id>\n';
        xmlTransaction += '<ssl_user_id>' + this.ssl_user_id + '</ssl_user_id>\n';
        xmlTransaction += '<ssl_pin>' + this.ssl_pin + '</ssl_pin>\n';
        xmlTransaction += '<ssl_test_mode>' + this.ssl_test_mode + '</ssl_test_mode>\n';
        xmlTransaction += '<ssl_transaction_type>ccquerytoken</ssl_transaction_type>\n';
        xmlTransaction += '<ssl_token>' + token + '</ssl_token>\n';
        xmlTransaction += '<ssl_result_format>HTML</ssl_result_format>\n';

        xmlTransaction += '</txn>\n';


        var urlToPost = this.ssl_test_mode ? testURL : productionURL;
        request.post({
            url: urlToPost,
            form: xmlTransaction
        }, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            xml2js.parseString(body, function (err, results) {
                if (err) {
                    return reject(err);
                }
                //clean the arrays
                results = cleanXML(results);
                return resolve(results);
            });
        });
    });
};

Converge.prototype.collectPaymentByToken = function (token, amount, invoiceNumber, description) {
    var deferred = Q.defer();
    //build txn node
    var xmlTransaction = '';
    xmlTransaction += 'xmldata=<txn>\n';
    xmlTransaction += '<ssl_add_token>Y</ssl_add_token>\n'
    xmlTransaction += '<ssl_merchant_id>' + this.ssl_merchant_id + '</ssl_merchant_id>\n';
    xmlTransaction += '<ssl_user_id>' + this.ssl_user_id + '</ssl_user_id>\n';
    xmlTransaction += '<ssl_pin>' + this.ssl_pin + '</ssl_pin>\n';
    xmlTransaction += '<ssl_test_mode>' + this.ssl_test_mode + '</ssl_test_mode>\n';
    xmlTransaction += '<ssl_description>' + description + '</ssl_description> \n';
    xmlTransaction += '<ssl_show_form>false</ssl_show_form>'
    xmlTransaction += '<ssl_transaction_type>ccsale</ssl_transaction_type>\n';
    xmlTransaction += '<ssl_amount>' + amount + '</ssl_amount>\n';
    xmlTransaction += '<ssl_result_format>HTML</ssl_result_format>\n';
    xmlTransaction += '<ssl_get_token>Y</ssl_get_token>\n';
    xmlTransaction += '<ssl_token>' + token + '</ssl_token>\n';
    xmlTransaction += '<ssl_invoice_number>' + invoiceNumber + '</ssl_invoice_number>\n';
    xmlTransaction += '</txn>\n';

    var urlToPost = this.ssl_test_mode ? testURL : productionURL;
    request.post({
        url: urlToPost,
        form: xmlTransaction
    }, function (error, response, body) {
        if (error) {
            return deferred.reject(error);
        }
        xml2js.parseString(body, function (err, results) {
            if (err) {
                return deferred.reject(err);
            }
            //clean the arrays
            results = cleanXML(results);
            return deferred.resolve(results);
        });
    });
    return deferred.promise;
};

Converge.prototype.verifyCard = function (cardNumber, expirationMonth, expirationYear, cvv ) {
    var deferred = Q.defer();
    //build txn node
    var xmlTransaction = '';
    xmlTransaction += 'xmldata=<txn>\n';

    xmlTransaction += '<ssl_merchant_id>' + this.ssl_merchant_id + '</ssl_merchant_id>\n';
    xmlTransaction += '<ssl_user_id>' + this.ssl_user_id + '</ssl_user_id>\n';
    xmlTransaction += '<ssl_pin>' + this.ssl_pin + '</ssl_pin>\n';
    xmlTransaction += '<ssl_test_mode>' + this.ssl_test_mode + '</ssl_test_mode>\n';
    xmlTransaction += '<ssl_show_form>false</ssl_show_form>'
    xmlTransaction += '<ssl_transaction_type>ccverify</ssl_transaction_type>\n';
    xmlTransaction += '<ssl_card_number>' + cardNumber + '</ssl_card_number>\n';
    xmlTransaction += '<ssl_exp_date>' + expirationMonth + expirationYear + '</ssl_exp_date>\n';
    xmlTransaction += '<ssl_result_format>HTML</ssl_result_format>\n';
    xmlTransaction += '<ssl_cvv2cvc2_indicator>1</ssl_cvv2cvc2_indicator>\n';
    xmlTransaction += '<ssl_cvv2cvc2>' + cvv + '</ssl_cvv2cvc2>\n';
    xmlTransaction += '</txn>\n';

    var urlToPost = this.ssl_test_mode ? testURL : productionURL;
    request.post({
        url: urlToPost,
        form: xmlTransaction
    }, function (error, response, body) {
        if (error) {
            return deferred.reject(error);
        }
        xml2js.parseString(body, function (err, results) {
            if (err) {
                return deferred.reject(err);
            }
            //clean the arrays
            results = cleanXML(results);
            return deferred.resolve(results);
        });
    });
    return deferred.promise;
};


//private function to get rid of additional array blocks
var cleanXML = function (xml) {
    var keys = Object.keys(xml),
        o = 0, k = keys.length,
        node, value, singulars,
        l = -1, i = -1, s = -1, e = -1,
        isInt = /^-?\s*\d+$/,
        isDig = /^(-?\s*\d*\.?\d*)$/,
        radix = 10;

    for (; o < k; ++o) {
        node = keys[o];
        if (xml[node] instanceof Array && xml[node].length === 1) {
            xml[node] = xml[node][0];
        }
        if (xml[node] instanceof Object) {
            value = Object.keys(xml[node]);
            if (value.length === 1) {
                l = node.length;
                singulars = [
                    node.substring(0, l - 1),
                    node.substring(0, l - 3) + 'y'
                ];
                i = singulars.indexOf(value[0]);
                if (i !== -1) {
                    xml[node] = xml[node][singulars[i]];
                }
            }
        }

        if (typeof(xml[node]) === 'object') {
            xml[node] = cleanXML(xml[node]);
        }

        if (typeof(xml[node]) === 'string') {
            value = xml[node].trim();
            if (value.match(isDig)) {
                if (value.match(isInt)) {
                    if (Math.abs(parseInt(value, radix)) <= Number.MAX_SAFE_INTEGER) {
                        xml[node] = parseInt(value, radix);
                    }
                } else {
                    l = value.length;
                    if (l <= 15) {
                        xml[node] = parseFloat(value);
                    } else {
                        for (i = 0, s = -1, e = -1; i < l && e - s <= 15; ++i) {
                            if (value.charAt(i) > 0) {
                                if (s === -1) {
                                    s = i;
                                } else {
                                    e = i;
                                }
                            }
                        }
                        if (e - s <= 15) {
                            xml[node] = parseFloat(value);
                        }
                    }
                }
            }
        }
    }
    return xml;
};

// export the class
module.exports = Converge;