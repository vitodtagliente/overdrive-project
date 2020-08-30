import fooModule from '../modules/foo';
import testModule from '../modules/test';
import UserModule from '../modules/userModule';

export default function () {
    return [
        new fooModule(),
        new testModule(),
        new UserModule()
    ];
}