<template>
  <div class="dashboard-main">
    <!-- 상단 요약 카드 -->
    <div class="dashboard-cards">
      <div class="dashboard-card">
        <div class="card-title">오늘 주문</div>
        <div class="card-value">23건</div>
      </div>
      <div class="dashboard-card">
        <div class="card-title">오늘 매출</div>
        <div class="card-value">₩1,200,000</div>
      </div>
      <div class="dashboard-card">
        <div class="card-title">정산 예정</div>
        <div class="card-value">₩3,500,000</div>
      </div>
      <div class="dashboard-card">
        <div class="card-title">라이브 시청자</div>
        <div class="card-value">128명</div>
      </div>
    </div>

    <!-- 차트/그래프 자리 -->
    <div class="dashboard-charts">
      <div class="chart-box">
        <canvas ref="chartRef" id="myChart" width="320" height="180"></canvas>
      </div>
      <div class="chart-box">
        <div ref="echartsRef" style="width:320px;height:180px;"></div>
      </div>
    </div>

    <!-- 최근 주문/문의 리스트 -->
    <div class="dashboard-lists">
      <div class="list-box">
        <div class="list-title">최근 주문</div>
        <ul>
          <li>2025-06-13 | 주문번호 12345 | 배송중</li>
          <li>2025-06-13 | 주문번호 12346 | 결제완료</li>
          <li>2025-06-12 | 주문번호 12344 | 배송완료</li>
        </ul>
      </div>
      <div class="list-box">
        <div class="list-title">최근 문의</div>
        <ul>
          <li>상품A | 배송 문의 | 답변대기</li>
          <li>상품B | 교환 문의 | 답변완료</li>
        </ul>
      </div>
    </div>
    <button @click="goToLiveChat">라이브 채팅 화면 보기</button> 
    /* 채팅방 확인용 임시버튼 */
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import * as echarts from 'echarts'






import { useRouter } from 'vue-router'

const router = useRouter();

function goToLiveChat() {
  router.push('/livechat');
}
//채팅방 확인용 임시버튼





Chart.register(...registerables)

const chartRef = ref(null)
const echartsRef = ref(null)

onMounted(() => {
  // Chart.js 막대그래프
  const ctx = chartRef.value.getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })

  // ECharts 도넛 파이차트
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  }
  if (echartsRef.value) {
    const myChart = echarts.init(echartsRef.value)
    myChart.setOption(option)
  }
})
</script>

<style scoped>
.dashboard-main {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.dashboard-cards {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.dashboard-card {
  flex: 1 1 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 1.2rem 1rem;
  text-align: center;
}
.card-title {
  color: #888;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.card-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3a3f51;
}
.dashboard-charts {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.chart-box {
  flex: 1 1 0;
  background: #f7f7fa;
  border: 1px dashed #ccd;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 1.1rem;
  border-radius: 8px;
}
.dashboard-lists {
  display: flex;
  gap: 1rem;
}
.list-box {
  flex: 1 1 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 1rem;
}
.list-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.list-box ul {
  padding-left: 1rem;
  margin: 0;
}
.list-box li {
  margin-bottom: 0.3rem;
  color: #333;
  font-size: 0.98rem;
}
</style>
