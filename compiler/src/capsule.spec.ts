import { getCapsuleName, isolate } from './capsule.utils';

describe('capsule utils', () => {
 it('should return a capsule name with no infix', () => {
    const res = getCapsuleName();
    expect(res).toContain('var/');
 });
 it('should return a capsule name with infix', () => {
    const INFIX: string = 'abcdefg';
    const res = getCapsuleName(INFIX);
    expect(res).toContain(INFIX);
 });

 it('should isolate the component with default options', async () => {
    const TEST_NAME = 'test_name'
    let compilerContextMock = {
        context: {
            isolate: jest.fn(),
            componentObject: {name: TEST_NAME}
        },
        configFiles: [],
        files: [],
        rawConfig: {}
    };
    let res = await isolate(compilerContextMock);
    expect(compilerContextMock.context.isolate).toHaveBeenCalledTimes(1);
 });
});

