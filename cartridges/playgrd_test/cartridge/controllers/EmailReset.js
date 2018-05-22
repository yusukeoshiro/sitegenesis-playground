'use strict'
var guard = require('playgrd_controllers/cartridge/scripts/guard');


const start = function () {
    const CustomerMgr = require('dw/customer/CustomerMgr');
    const HashMap = require('dw/util/HashMap');
    const map = new HashMap();

    map.put('email','*');
    const customerItr = CustomerMgr.queryProfiles( map, 'email' ); // 全ユーザーを取得

    while ( customerItr.hasNext() ) {
        let customer = customerItr.next();
        sendPasswordResetEmail( customer.email );
    }    
}


/**
 * 指定されたメールアドレスのユーザーに対してパスワードリセットメールを送る
 * @param email {string} - ユーザーのメールアドレス
 */
const sendPasswordResetEmail = function ( email ) {

    const app = require('playgrd_controllers/cartridge/scripts/app');
    const Resource = require('dw/web/Resource');

    const Customer = app.getModel('Customer');
    const Email = app.getModel('Email');

    const resettingCustomer = Customer.retrieveCustomerByLogin(email); // email と login が一緒である想定

    if (!empty(resettingCustomer)) {
        resetPasswordToken = resettingCustomer.generatePasswordResetToken();

        passwordemail = Email.get('mail/resetpasswordemail', resettingCustomer.object.profile.email); // email instance 生成
        passwordemail.setSubject(Resource.msg('resource.passwordassistance', 'email', null)); // 件名設定
        passwordemail.send({
            ResetPasswordToken: resetPasswordToken,
            Customer: resettingCustomer.object.profile.customer
        }); // パラメタ設定して送る
    }
}

exports.Start = guard.ensure([], start);