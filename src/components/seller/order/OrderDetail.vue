<template>
  <div class="order-detail-page">
    <!-- 주문 상품 테이블 -->
    <section class="product-table-section">
      <h3>전체 주문</h3>
      <table class="product-table">
        <thead>
          <tr>
            <th>No</th>
            <th>진행상태/상품타입</th>
            <th>주문상품</th>
            <th>주문금액</th>
            <th>배송비</th>
            <th>적립금</th>
            <th>할인/추가혜택</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <div class="badge green">배송상품</div>
            </td>
            <td>
              <img :src="item.image" class="product-img" />
              {{ item.name }}
              <div class="badge yellow">배송대기</div>
            </td>
            <td>{{ item.price }}</td>
            <td class="green">{{ item.deliveryFee }}</td>
            <td>{{ item.point }}</td>
            <td>{{ item.benefit }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 혜택/요약 -->
    <section class="summary-wrapper">
      <div class="benefit-box">
        <h4>혜택 상세정보 (할인/적립금)</h4>
        <ul>
          <li>주문쿠폰 <span>0원</span></li>
          <li>상품쿠폰 <span>0원</span></li>
          <li>적립금 사용 <span class="orange">6,016원</span></li>
          <li>프로모션코드 <span>0원</span></li>
          <li>적립금 <span>0원</span></li>
        </ul>
      </div>
      <div class="invoice-box">
        <h4>주문서 ({{ orderNo }})</h4>
        <ul>
          <li>상품개수 <span>2개</span></li>
          <li>총 상품금액 <span class="blue">16원</span></li>
          <li>총 배송비 <span class="green">+ 6,000원</span></li>
          <li>할인금액 <span class="orange">- 6,016원</span></li>
          <li>합계금액 <span>0원</span></li>
          <li>실 결제금액 <span class="red">0원</span></li>
        </ul>
        <div class="order-date">주문일시 : 2025-06-18 (14:24:38)</div>
      </div>
    </section>

    <!-- 결제 정보 -->
    <section class="payment-box">
      <h4>결제 정보</h4>
      <div class="button-group">
        <button class="red-btn">강제취소 처리하기</button>
        <button class="border-btn">주문목록 바로가기</button>
      </div>
      <p class="warning">
        ※ 강제취소는 PG사에서 직접 결제를 취소해야 할 경우에만 사용하세요.
      </p>
    </section>

    <!-- 취소 정보 -->
    <section class="info-section">
      <h4>취소 정보</h4>
      <table class="info-table">
        <tbody>
          <tr>
            <th>부분취소/환불액</th>
            <td>0원</td>
            <th>참고사항</th>
            <td rowspan="3">
              부분 취소 요청 및 완료된 주문상품의 환불 금액이 표시됩니다.<br />
              전체 취소시 취소 비용은 포함되지 않습니다.
            </td>
          </tr>
          <tr>
            <th>부분취소시 환불한 적립금</th>
            <td>0원</td>
          </tr>
          <tr>
            <th>합계금액</th>
            <td>0원</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 주문자 정보 -->
    <section class="info-section">
      <h4>주문자 정보</h4>
      <table class="info-table">
        <tbody>
          <tr>
            <th>회원타입</th>
            <td colspan="3">
              <label><input type="radio" checked /> 회원</label>
              <label><input type="radio" /> 비회원</label>
            </td>
          </tr>
          <tr>
            <th>아이디</th>
            <td><input type="text" value="master" readonly /></td>
            <th>이름</th>
            <td>관리자</td>
          </tr>
          <tr>
            <th>휴대폰번호</th>
            <td><input type="text" value="010-1111-1111" readonly /></td>
            <th>이메일</th>
            <td><input type="text" value="help@domain.com" readonly /></td>
          </tr>
          <tr>
            <th>기기정보</th>
            <td colspan="3">
              [OS] Windows 10<br />
              [Browser] Chrome<br />
              [IP] 125.131.208.230<br />
              [Agent] Mozilla/5.0 ...
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 받는 분 정보 -->
    <section class="info-section">
      <h4>받는 분 정보</h4>
      <table class="info-table">
        <tbody>
          <tr>
            <th>이름</th>
            <td><input type="text" value="관리자" /></td>
            <th>휴대폰번호</th>
            <td><input type="text" value="010-1111-1111" /></td>
          </tr>
          <tr>
            <th>배송지 주소</th>
            <td colspan="3">
              <input type="text" value="61954" style="width: 100px" />
              <button class="black-btn">주소찾기</button>
              <input type="text" value="광주 서구 2순환로 2275" style="width: 80%" />
              <input type="text" value="2" style="width: 80%" />
              <input type="text" value="광주 서구 치평동 1132-34" style="width: 80%" />
            </td>
          </tr>
          <tr>
            <th>배송시 유의사항</th>
            <td colspan="3">
              <textarea placeholder="배송시 유의사항"></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 메모 -->
    <section class="info-section">
      <h4>관리용 메모</h4>
      <table class="info-table">
        <tbody>
          <tr>
            <th>메모 내용</th>
            <td><textarea placeholder="관리용 메모"></textarea></td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 확인 버튼 -->
    <div class="bottom-buttons">
      <button class="red-btn">확인</button>
      <button class="border-btn">목록</button>
    </div>
  </div>
</template>

<script setup>
const orderNo = '16910-20314-69919'
const items = [
  {
    image: 'https://via.placeholder.com/50',
    name: '유기농 통밀빵',
    price: '4원',
    deliveryFee: '3,000원 개별배송',
    point: '0원',
    benefit: '할인/혜택없음'
  },
  {
    image: 'https://via.placeholder.com/50',
    name: '명장 초코 도넛',
    price: '12원',
    deliveryFee: '3,000원 개별배송',
    point: '0원',
    benefit: '할인/혜택없음'
  }
]
</script>

<style scoped src="@/assets/order/orderDetail.css"></style>