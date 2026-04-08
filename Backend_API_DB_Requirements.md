# K-Radon Dashboard 백엔드 요구사항 명세서 (최종판)

본 문서는 K-Radon Dashboard 웹 애플리케이션의 인증(로그인/회원가입), 메인 데이터 연동, 그리고 과금(Billing) 메뉴까지 전반적인 데이터베이스 스키마 및 REST API 명세를 정의합니다.

---

## 1. Database 스키마 설계 (초안)

### 1.1. User (사용자/업체 계정 정보)
대시보드 로그인 및 과금/세금계산서 발행 시 사용되는 주체 데이터입니다.
* `user_id` (PK, INT) : 내부 고유 식별자
* `login_id` (VARCHAR) : (사용자 입력) 로그인 아이디
* `password` (VARCHAR) : 암호화된 비밀번호
* `company_name` (VARCHAR) : 업체명
* `business_reg_num` (VARCHAR) : 사업자등록번호
* `representative_name` (VARCHAR) : 대표자명
* `contact_name` (VARCHAR) : 담당자명
* `contact_phone` (VARCHAR) : 담당자 연락처
* `contact_email` (VARCHAR) : 담당자 E-mail (일반 연락용)
* `tax_email` (VARCHAR) : 세금계산서 수령용 E-mail
* `business_reg_file_url` (VARCHAR) : 가입 시 업로드한 사업자등록증 사본의 스토리지 경로/URL
* `created_at` (DATETIME) : 가입 일시

### 1.2. Device (기기 정보)
대시보드 메인 화면 좌측에 표시되는 연결 기기의 메타 데이터입니다.
* `device_serial` (PK, VARCHAR) : 기기 시리얼 넘버
* `fw_version` (VARCHAR) : 펌웨어 버전
* `battery_level` (INT) : 배터리 잔량 (%)
* `last_check_date` (DATETIME) : 마지막 점검 일자 
* `user_id` (FK, INT) : 기기를 소유/관리하는 회원 ID

### 1.3. Section (측정 구역/세션 목록)
하나의 기기가 측정한 여러 번의 세션(구역별 측정 등) 리스트입니다.
* `section_id` (PK, INT) : 섹션 고유 ID
* `device_serial` (FK, VARCHAR) : 연결된 기기 시리얼
* `user_info` (VARCHAR) : 사용자 입력 식별값 혹은 메모 (ex: '거실 측정 데이터')
* `data_count` (INT) : 해당 섹션에 속한 라돈 데이터의 총 개수
* `is_unlocked` (BOOLEAN) : 데이터 로드(과금)가 완료되어 열람 가능한 상태 여부
* `created_at` (DATETIME) : 측정 일시

### 1.4. BillingLog (과금 및 결제 내역)
BillingPage에 표출되는 월별 혹은 건별 과금 내역입니다.
* `billing_id` (PK, INT) : 과금 이력 고유 ID
* `user_id` (FK, INT) : 대상 회원 ID
* `usage_date` (VARCHAR) : 사용 연월 (ex: "2026-03")
* `cost` (INT) : 청구/차감된 과금 비용 (원)
* `details` (VARCHAR) : 세부 내용 메모 (비용 세부 확인 모달용)
* `created_at` (DATETIME) : 발생 일시

---

## 2. REST API 엔드포인트 명세

### 2.1. 인증 및 계정 (Auth)
* **[POST] `/api/auth/signup`**
  * **Description:** 회원가입 (Multipart/form-data 처리 필요 - 사업자등록증 파일 업로드)
  * **Payload:** `loginId`, `password`, `companyName`, `businessRegNum`, `representativeName`, `contactName`, `contactPhone`, `contactEmail`, `taxEmail`, `businessRegFile`(File)
* **[POST] `/api/auth/login`**
  * **Description:** 로그인 및 토큰 발급 (`loginId`, `password`)
* **[POST] `/api/auth/find-id`**
  * **Description:** 아이디 찾기 (업체명, 사업자등록번호 기반 매칭) : 별도 이메일 전송은 없고 아이디/담당자 E-mail (일반 연락용) 2가지 정보만 리턴
* **[POST] `/api/auth/find-pw`**
  * **Description:** 비밀번호 찾기 (아이디, 업체명, 사업자등록번호 매칭 성공 시 등록된 이메일로 메일 발송)
* **[GET] `/api/user/profile`**
  * **Description:** 내 정보 조회 
* **[PUT] `/api/user/profile`**
  * **Description:** 내 정보 수정

### 2.2. 기기 및 메인 대시보드 데이터
* **[GET] `/api/devices/{deviceSerial}`**
  * **Description:** 기기 정보 조회 (F/W, 배터리 등)
* **[GET] `/api/devices/{deviceSerial}/sections`**
  * **Description:** 기기에 저장된 Section 리스트 조회
* **[DELETE] `/api/sections/{sectionId}`**
  * **Description:** 특정 Section 데이터베이스 삭제
* **[POST] `/api/sections/{sectionId}/load`**
  * **Description:** Section 데이터 열람 권한 구매 (과금 부과 로직 연동) 
* **[GET] `/api/sections/{sectionId}/data`**
  * **Description:** 열람 권한이 있는 Section에 한해, 그래프용 `MeasurementData` 배열 반환

### 2.3. 과금 페이지 (Billing)
* **[GET] `/api/billing`**
  * **Description:** 회원의 기간별 과금 내역 조회
  * **Query Params:** `startDate` (사용연월 시작), `endDate` (사용연월 끝), `searchKeyword` (업체명 등 검색어)
  * **Response:**
    ```json
    [
      {
        "id": 1,
        "usageDate": "2026-03",
        "cost": 15600,
        "details": "기기 1 측정 데이터 1560건 전송"
      }
    ]
    ```

---

## 3. 프론트엔드-백엔드 추가 논의 필요 사항

1. **로그인 유지 방식**: JWT를 활용한 Bearer Token 방식(하나의 계정으로 여러 명이 접속하는 공용 계정 방식을 쓸 예정)
2. **사업자등록증 파일 처리**: 회원가입 시 업로드된 파일을 Blob에 저장.
