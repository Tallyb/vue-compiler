import { getCapsuleName } from './capsule.utils';

describe('capsule utils', () => {
 it('should return a capsule name with no infix', () => {
    const res = getCapsuleName();
    expect(res).toBeTruthy();
 });
});