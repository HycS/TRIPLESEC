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

/*

    describe('추천 검색어 제공 기능', function() {
        it("추천 검색어 제공 함수 showRecommendKeyword가 존재한다", function() {
            expect(typeof api.showRecommendKeyword).toBeDefined();
            expect(typeof api.showRecommendKeyword).toBe("function");
        });

        describe('검색어 제공 정상 여부 체크', function() {
            let function1;
            let result1 = 0;
            beforeAll(function(done) {
                function1 = api.showRecommendKeyword("t", function(err, rows) {
                    result1 = rows;
                    done();
                });
            });

            it("검색어 t를 입력받아 t가 들어있는 장소의 목록을 return한다", function(done) {
                expect(result1).toBeDefined();
                expect(result1).not.toBe(null);
                done();
            });

        });
    //describe 추천 검색어 제공 기능 END
    });

    describe('장소 추가 기능', function() {
        it("장소 추가 함수 addPlace가 존재한다", function() {
            expect(typeof api.addPlace).toBeDefined();
            expect(typeof api.addPlace).toBe("function");
        });

        describe('코스 정상 추가 여부 체크', function() {
            let function1;
            let result1 = 0;
            beforeAll(function(done) {
                function1 = api.addPlace("test course1", 20170101, 20170105, "custom", function(err, courseID) {
                    result1 = placeID;
                    done();
                });
            });
        });
    //describe 장소 추가 기능 END
    });
//describe api.js END
*/
});







/*
    describe('장소 추가 기능', function() {
        //장소 추가 함수 createPlace 관련 구현 사항
        it("장소 추가 함수 createPlace가 존재한다", function() {
            expect(typeof api.createPlace).toBeDefined();
            expect(typeof api.createPlace).toBe("function");
        });
        it("createPlace는 파라미터를 받아 성공, 실패 여부를 리턴한다.", function() {
            var result = api.createPlace();
            expect(result).toBe(true);
        });
    });
*/

/*
    describe('유사 검색어 키워드 제공 기능', function() {
        //유사 검색어 키워드 제공 함수 recommendKeywords 관련 구현 사항
        it("장소 추가 함수 recommendKeywords가 존재한다", function() {
            expect(typeof api.recommendKeywords).toBeDefined();
            expect(typeof api.recommendKeywords).toBe("function");
        });
        it("recommendKeywords는 글자 'c'를 입력 받아 연관 결과 집합을 리턴한다", function() {
            expect(api.recommendKeywords("c")).toBeTruthy();
            expect(api.recommendKeywords("c")).toContain("c");
        });
        it("recommendKeywords는 글자 'f'를 입력 받아 연관 결과 집합을 리턴한다", function() {
            expect(api.recommendKeywords("f")).toBeTruthy();
            expect(api.recommendKeywords("f")).toContain("f");
        });
        it("recommendKeywords는 글자 '시'를 입력 받아 연관 결과 집합을 리턴한다", function() {
            expect(api.recommendKeywords("시")).toBeTruthy();
            expect(api.recommendKeywords("시")).toContain("시");
        });
        it("recommendKeywords는 글자 't'를 입력 받아 연관 결과 집합을 리턴한다", function() {
            expect(api.recommendKeywords("t")).toBeTruthy();
            expect(api.recommendKeywords("t")).toContain("t");
        });
        it("recommendKeywords는 글자 '静'를 입력 받아 연관 결과 집합을 리턴한다", function() {
            expect(api.recommendKeywords("静")).toBeTruthy();
            expect(api.recommendKeywords("静")).toContain("静");
        });
    });

  it("mysql이 null 되어서는 안 된다", function() {
      expect(typeof index.mysql).not.toBe("null");
      expect(index).not.toThrowError();
  })
  it("mysql connection이 null 되어서는 안 된다", function() {
      expect(typeof index.connection).not.toBe("null");
  })
*/
/*
  it('helloWorld 함수가 존재한다', function() {
    expect(typeof index.helloWorld).not.toBe("undefined"); //존재하지 않는다가 아니어야 한다.
    expect(typeof index.helloWorld).toBe("function"); //함수여야 한다.
  });

  it("helloWorld 함수가 호출되면 'Hello World!' 문자가 출력되어야 한다",  function() {
    expect(index.helloWorld()).toBe("Hello World!");
  });
*/