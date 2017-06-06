//File: server_spec.js

describe('server_spec.js', function() {
    let server;

    beforeEach(function() {
        //server.js에 정의한 모듈을 로드한다.
        server = require('server.js');
    });

    describe('server.js 로드 관련', function() {
        it("server.js가 defined 되어있어야 한다", function() {
            expect(typeof api).toBeDefined();
        });
    });
});