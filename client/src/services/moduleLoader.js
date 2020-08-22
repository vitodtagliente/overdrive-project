import fooModule from '../modules/foo';
import testModule from '../modules/test';

export default function () {
    return [
        new fooModule(),
        new testModule()
    ];
}