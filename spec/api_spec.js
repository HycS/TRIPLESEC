//file: api_spec.js

describe('api.js', function() {
    let api;

    beforeEach(function() {
        //api.js에 정의한 모듈을 로드한다.
        api = require('../src/api.js');
    });

    describe('mysql 연결 관련', function() {
        it("mysql이 null 되어서는 안 되며 연결 시 에러가 나서는 안 된다", function() {
            expect(typeof api.mysql).toBeDefined();
            expect(typeof api.mysql).not.toBe("null");
        });
        it("mysql connectionPool이 null 되어서는 안 된다", function() {
            expect(typeof api.connectionPool).not.toBe("null");
        });
    });

    describe('api.js 로드 관련', function() {
        it("api.js가 defined 되어있어야 한다", function() {
            expect(typeof api).toBeDefined();
        });
    });

    describe('코스 추가 기능', function() {

        //코스 추가 함수 addCourseSet 관련 구현 사항
        it("코스 추가 함수 addCourseSet가 존재한다", function() {
            expect(typeof api.addCourseSet).toBeDefined();
            expect(typeof api.addCourseSet).toBe("function");
        });

        describe('코스 정상 추가 여부 체크', function() {
            let function1;
            let result1 = 0;
            beforeAll(function(done) {
                function1 = api.addCourseSet("test course1", 20170101, 20170105, "custom", function(err, courseID) {
                    result1 = courseID;
                    done();
                });
            });

            it("addCourse는 코스 1을 추가하고 course_set의 id값을 리턴한다.", function(done) {
                expect(result1).toBeDefined();
                expect(result1).not.toBe(0);
                done();
            });
        });
/*
        describe('코스 날짜 범위 검사 여부 체크', function() {
            let function2;
            let result2 = 0;
            beforeAll(function(done) {
                function2 = api.addCourseSet("test course2", 20178899, 20171234, "custom", function(err, courseID) {
                    result2 = courseID;
                    done();
                });
            });

            it("addCourse는 코스 2를 추가하려고 시도하지만, 잘못된 날짜 범위를 입력하고 실패해서 false를 리턴한다", function(done) {
                expect(result2).toBeDefined();
                expect(result2).toBe(false);
                done();
            });
        });

        describe('코스 타입 범위 검사 여부 체크', function() {
            let result3 = 0;
            beforeAll(function(done) {
                api.addCourseSet("test course3", 20170301, 20170305, "asdf", function(err, courseID) {
                    result3 = courseID;
                    done();
                });
            });

            it("addCourse는 코스 3을 추가하려고 시도하지만, 잘못된 코스 타입을 입력하고 실패해서 false를 리턴한다", function(done) {
                expect(result3).toBeDefined();
                expect(result3).toBe(false);
                done();
            });
        });
*/
    //describe 코스 추가 기능 END
    });

    describe('장소 정보 목록 제공 기능', function() {

        //장소 정보 (전체) 목록 제공 함수 관련 구현 사항
        it("장소 정보 목록 제공 함수 getPlacesList가 존재한다", function() {
            expect(typeof api.getPlacesList).toBeDefined();
            expect(typeof api.getPlacesList).toBe("function");
        });

        describe('장소 정보 정상 제공 여부 체크', function() {
            let function1;
            let resultList;
            beforeAll(function(done) {
                function1 = api.getPlacesList(function(err, result) {
                    resultList = result;
                    done();
                });
            });

            it("장소 정보 목록 제공 함수 ", function(done) {
                expect(resultList).toBeDefined();
                expect(resultList).not.toBe(null);
                done();
            });
        });
    });
});