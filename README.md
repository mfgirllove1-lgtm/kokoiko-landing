# KOKOIKO 랜딩페이지 (일본어)

## 파일 구조
| 파일 | 역할 |
| --- | --- |
| index.html | 메인 (지도, 투어 목록, 준비 중 서비스) |
| jeonju-damyang.html / gangneung.html / danyang.html | 상품 상세 (일정, 동선 지도, 비교표, 달력, 예약) |
| checkout.html | 예약 정보 입력 + 토스 결제 위젯 |
| success.html | 결제 승인 요청 → 예약 접수(출발 확정 대기) 화면 |
| fail.html | 결제 실패·취소 안내 (승인 API 호출 안 함) |
| tokushoho.html | 特定商取引法に基づく表記, キャンセルポリシー, 한국 사업자 정보 자리 |
| api/config.js | 클라이언트 키만 전달 |
| api/order.js | 상품ID·인원만 받고 금액·orderId는 서버가 결정 |
| api/confirm.js | 서버 가격표와 금액 비교 → 토스 승인 요청 (시크릿 키는 여기서만) |
| api/_products.js | 서버 가격표 (금액의 기준) |
| data.js | 화면 표시용 데이터, 엔화 환산 기준(100엔=870원, 1줄로 수정) |

## 환경변수 (Vercel)
- TOSS_CLIENT_KEY, TOSS_SECRET_KEY : 가이드 7-1의 문서용 테스트 키
- PAY_CURRENCY (선택) : 엔화 다통화 결제 계약 후 JPY 로 바꾸고 api/_products.js 의 priceJpy 입력

## 채택 후 클라이언트가 채울 것
- tokushoho.html 의 {중괄호} 항목 (운영책임자, 주소, 전화, 사업자등록번호 등)
- success.html 의 LINE 공식 계정 URL
- 실제 예약 인원 데이터 (지금 달력의 인원은 샘플)
- 실제 사진 (지금은 플레이스홀더 + alt)
