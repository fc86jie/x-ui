<!--
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-02-25 09:58:40
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-02-25 17:22:09
 * @FilePath: \packages\timeSelection\TimeSelection.vue
 * @Description: 
-->

<template>
  <div class="x-calendar" ref="calendarRef">
    <!-- 框选范围框 -->
    <div class="x-schedule" ref="scheduleRef"></div>
    <!-- 表格显示区 -->
    <table class="x-calendar-table">
      <thead class="x-calendar-head">
        <tr>
          <th rowspan="8" class="week-td">星期/时间</th>
          <th colspan="24">00:00 - 12:00</th>
          <th colspan="24">12:00 - 24:00</th>
        </tr>
        <tr>
          <td v-for="(item, index) in dayHour" :key="index" colspan="2" v-text="item"></td>
        </tr>
      </thead>
      <tbody class="x-calendar-body">
        <tr v-for="(item, index) in weekName" :key="index">
          <td v-text="item"></td>
          <td
            v-for="(week, idx) in dayHalfHour"
            :key="idx"
            :data-week="index"
            :data-time="week"
            class="calendar-atom-time"
            v-on:mousedown="() => onMousedown(index, week)"
            v-on:mouseenter="onMouseenter"
            v-on:mouseleave="onMouseleave"></td>
        </tr>
        <tr>
          <td colspan="49">
            <div>
              <span class="pull-left">{{ selectedTimeList.length ? '已选择时间段' : '可拖动鼠标选择时间' }}</span>
              <a class="pull-right" @click="onResetAllClick">清空选择</a>
            </div>
            <div v-if="selectedTimeList.length" class="td-selected-time">
              <p v-for="(item, index) in selectedTimeList" :key="index">
                <span>{{ item['week'] }}：</span>
                <span class="item-text">{{ item['time'] }}</span>
              </p>
            </div>
          </td>
        </tr>
      </tbody>
      <!-- 悬浮提示 -->
      <div class="x-calendar-popover">
        <div ref="popoverRef" class="x-calendar-popover-wrapper" v-show="isPopover">
          <div class="x-calendar-popover-arrow"></div>
          <div class="x-calendar-popover-panel">
            <div class="x-calendar-popover-body" v-text="`${hoverWeek} ${hoverTime}`"></div>
          </div>
        </div>
      </div>
    </table>
  </div>
</template>
<script>
import { defineComponent, nextTick, computed, reactive, ref, watch, onMounted, toRefs } from 'vue';
import { addClass, removeClass, hasClass } from './util';

export default defineComponent({
  name: 'XTimeSelection',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const dayHour = Array.from({ length: 24 }, (v, k) => k);
    const dayHalfHour = Array.from({ length: 48 }, (v, k) => k);
    const weekName = ['一', '二', '三', '四', '五', '六', '日'].map(day => `星期${day}`);
    const weekMap = { ...weekName };

    let startTd = '',
      endTd = null,
      startPoint = {
        x: '',
        y: '',
      },
      hoverTimeoutId = 0,
      popOverCanShow = false,
      curTd = null,
      isAdd = false;

    const state = reactive({
      hoverWeek: '',
      hoverTime: '',
      isPopover: false,
      selectedTimeList: [],
    });

    /**
     * 格式化输入数据
     * '0-0.5,1-2.5,9-10||||||' => [[0,2,3,4,18,19],[],[],[],[],[],[]]
     * @param {*} value
     */
    const formatInputData = value => {
      let data = value || '||||||';
      let weekSchedule = [];
      let weekList = data.split('|');
      setTimeList(weekList);
      weekList.forEach((week, index) => {
        weekSchedule[index] = [];
        // '0-0.5,1-2.5,9-10' => ['0-0.5', '1-2.5', '9-10']
        let hourList = week.split(',');
        hourList.forEach(hour => {
          let hourRanger = hour.split('-');
          // [1,2.5] => [2,3,4,5]
          for (let i = hourRanger[0] * 2; i < hourRanger[1] * 2; i++) {
            weekSchedule[index].push(i);
          }
        });
      });
      return weekSchedule;
    };

    /**
     * 格式化输出数据
     * [[0,2,3,4,18,19],[],[],[],[],[],[]] => '0-0.5,1-2.5,9-10||||||'
     * @param {*} data
     */
    const formatOutputData = data => {
      let result = [];
      let weekSchedule = JSON.parse(JSON.stringify(data));
      weekSchedule.forEach((week, index) => {
        // 组件生成的是无序的，需要排序
        week = week.sort((a, b) => {
          return a - b;
        });

        // [0,2,3,4,18,19] => [[0],[2,3,4],[18,19]]
        let timeList = week
          .reduce((timeList, value) => {
            if (timeList.length && value - timeList[0][0] === 1) {
              timeList[0].unshift(value);
            } else {
              timeList.unshift([value]);
            }
            return timeList;
          }, [])
          .reverse()
          .map(v => v.reverse());
        // [[0], [2,3,4], [18,19]] => ['0-0.5', '1-2.5', '9-10']
        let list = [];
        timeList.forEach(time => {
          list.push(time[0] / 2 + '-' + (time[time.length - 1] + 1) / 2);
        });
        result[index] = list.join(',');
      });
      setTimeList(result);
      return result.join('|') === '||||||' ? '' : result.join('|');
    };

    const setHoverData = evt => {
      let hoverEle = evt.target;
      let HoverDataWeek = hoverEle.getAttribute('data-week');
      let HoverDataTime = hoverEle.getAttribute('data-time');
      popOverCanShow = true;
      let hour = Math.floor(HoverDataTime / 2)
          .toString()
          .padStart(2, '0'),
        hoverTimeText =
          HoverDataTime % 2 ? `${hour}:30 - ${(+hour + 1).toString().padStart(2, '0')}:00` : `${hour}:00 - ${hour}:30`;
      hoverTimeoutId && clearTimeout(hoverTimeoutId);
      hoverTimeoutId = setTimeout(() => {
        state.hoverWeek = weekMap[HoverDataWeek];
        state.hoverTime = hoverTimeText;
        state.isPopover = !!popOverCanShow;
        clearTimeout(hoverTimeoutId);
        nextTick().then(() => {
          setPopoverPos(hoverEle);
        });
      }, 500);
    };

    const setPopoverPos = ele => {
      let eleRect = getClientPosition(ele, true);
      let popoverEle = popoverRef.value;
      let popoverReact = getClientPosition(popoverEle.parentNode, true);
      popoverEle.style.transform = `translate3d(${
        eleRect.x - popoverReact.x - popoverEle.offsetWidth / 2 - ele.offsetWidth / 2
      }px, ${eleRect.y - popoverReact.y - popoverEle.offsetHeight - ele.offsetHeight}px, 0px)`;
    };

    const removeHoverData = evt => {
      popOverCanShow = false;
      state.hoverWeek = '';
      state.hoverTime = '';
      state.isPopover = false;
    };

    const setFirstSource = (weekIndex, timeIndex) => {
      let timeList = week_schedule.value[weekIndex];
      isAdd = !timeList || -1 === timeList.indexOf(timeIndex);
    };

    const onResetAllClick = () => {
      week_schedule.value = [[], [], [], [], [], [], []];
      let calendarEle = calendarRef.value;
      let calendarAtomTimeEles = calendarEle.querySelectorAll('.calendar-atom-time');
      calendarAtomTimeEles.forEach(item => {
        removeClass(item, 'ui-selected');
      });
    };

    const getClientPosition = (ele, isAdd) => {
      let rect = ele.getBoundingClientRect();
      return {
        x: rect.left + (isAdd ? rect.width : 0),
        y: rect.top + (isAdd ? rect.height : 0),
      };
    };

    const scheduleEnd = () => {
      if (startPoint) {
        startPoint = null;
        endTd = curTd;
        removeClass(scheduleRef.value, 'no-transition');
        highlightScheduleArea(startTd, endTd);
      }
    };

    const highlightScheduleArea = (startTd, endTd) => {
      if (startTd && endTd) {
        let scheduleEle = scheduleRef.value,
          startTdWeek = parseInt(startTd.getAttribute('data-week')),
          startTdTime = parseInt(startTd.getAttribute('data-time')),
          endTdWeek = parseInt(endTd.getAttribute('data-week')),
          endTdTime = parseInt(endTd.getAttribute('data-time')),
          minWeek = Math.min(startTdWeek, endTdWeek),
          maxWeek = Math.max(startTdWeek, endTdWeek),
          minTime = Math.min(startTdTime, endTdTime),
          maxTime = Math.max(startTdTime, endTdTime);

        scheduleEle.style.opacity = 0;
        setTimeout(() => {
          scheduleEle.style.display = 'none';
        }, 500);
        getSelectedCollection(minTime, minWeek, maxTime, maxWeek);
      }
    };

    const getSelectedCollection = (minTime, minWeek, maxTime, maxWeek) => {
      let calendarAtomTimeEles = calendarRef.value.querySelectorAll('.calendar-atom-time');
      calendarAtomTimeEles.forEach(item => {
        let time = parseInt(item.getAttribute('data-time')),
          week = parseInt(item.getAttribute('data-week')),
          index = week_schedule.value[week].indexOf(time);

        if (time >= minTime && time <= maxTime && week >= minWeek && week <= maxWeek) {
          if (week_schedule.value[week] === undefined) {
            week_schedule.value[week] = [];
            week_schedule.value[week].push(time);
          }

          if (week_schedule.value[week]) {
            if (isAdd) {
              if (index === -1) {
                week_schedule.value[week].push(time);
                addClass(item, 'ui-selected');
              }
            } else {
              if (index > -1) {
                week_schedule.value[week].splice(index, 1);
                removeClass(item, 'ui-selected');
              }
            }
          }
        }
      });
      context.emit('update:modelValue', formatOutputData(week_schedule.value));
    };

    const onMousedown = (weekIndex, timeIndex) => {
      setFirstSource(weekIndex, timeIndex);
    };

    const onMouseenter = evt => {
      setHoverData(evt);
    };

    const onMouseleave = evt => {
      removeHoverData(evt);
    };

    const recoverDisplay = () => {
      // 清空所有选中项
      let calendarAtomTimeEles = calendarRef.value.querySelectorAll('.calendar-atom-time');
      calendarAtomTimeEles.forEach(item => {
        removeClass(item, 'ui-selected');
      });
      // 恢复需要选中的
      week_schedule.value.forEach((week, weekIndex) => {
        let weekEle = calendarRef.value.querySelectorAll('tr')[weekIndex + 2];
        week.forEach(time => {
          let timeEle = weekEle.querySelectorAll('td')[time + 1];
          timeEle.className = 'calendar-atom-time ui-selected';
        });
      });
    };

    const setTimeList = list => {
      state.selectedTimeList = [];
      // ['0-0.5,3-6', '1-5']
      list.forEach((week, index) => {
        if (week) {
          let oneWeekTime = {
            week: '',
            time: '',
          };
          oneWeekTime.week = weekMap[index];
          let timeList = [];
          let weekArray = week.split(',');
          // ['0-0.5', '3-6']
          weekArray.forEach(week => {
            let timeArray = week.split('-');
            let startText = generateText(timeArray[0]);
            let endText = generateText(timeArray[1]);
            timeList.push(startText + '~' + endText);
            function generateText(time) {
              return time.indexOf('.') > -1 ? `${parseInt(time.padStart(2, '0'))}:30` : `${time.padStart(2, '0')}:00`;
            }
          });

          oneWeekTime.time = timeList.join(',');
          state.selectedTimeList.push(oneWeekTime);
        }
      });
    };

    const calendarRef = ref();
    const scheduleRef = ref();
    const popoverRef = ref();

    let week_schedule = computed({
      get: () => formatInputData(props.modelValue),
      set: value => {
        context.emit('update:modelValue', formatOutputData(value));
      },
    });

    watch(
      () => week_schedule.value,
      () => {
        // 恢复数据
        recoverDisplay();
      }
    );

    // 恢复数据
    onMounted(() => {
      recoverDisplay();
      let calendarEle = calendarRef.value;
      calendarEle.addEventListener('mousedown', evt => {
        if (hasClass(evt.target, 'calendar-atom-time') && evt.which === 1 && (startTd = evt.target)) {
          startPoint = getClientPosition(evt.target, false);
          let scheduleEle = scheduleRef.value;
          scheduleEle.style.width = 0;
          scheduleEle.style.height = 0;
          scheduleEle.style.left = `${startPoint.x}px`;
          scheduleEle.style.top = `${startPoint.y}px`;
          scheduleEle.style.opacity = 0.6;
          scheduleEle.style.display = 'block';
          addClass(scheduleEle, 'no-transition');
        }
      });

      calendarEle.addEventListener('mousemove', evt => {
        curTd = document.elementFromPoint(evt.clientX, evt.clientY);
        let curTdPos = getClientPosition(curTd, true);
        if (startPoint) {
          let diffX = curTdPos.x - startPoint.x,
            diffY = curTdPos.y - startPoint.y,
            top = diffY > 0 ? startPoint.y : curTdPos.y - 20,
            left = diffX > 0 ? startPoint.x : curTdPos.x - 10,
            width = diffX > 0 ? Math.abs(diffX) : Math.abs(diffX) + 22,
            height = diffY > 0 ? Math.abs(diffY) : Math.abs(diffY) + 42;

          let scheduleEle = scheduleRef.value;
          scheduleEle.style.width = `${width}px`;
          scheduleEle.style.height = `${height}px`;
          scheduleEle.style.top = `${top}px`;
          scheduleEle.style.left = `${left}px`;
        }
      });

      calendarEle.addEventListener('mouseup', () => {
        scheduleEnd();
      });

      calendarEle.addEventListener('mousewheel', () => {
        scheduleEnd();
      });

      calendarEle.addEventListener('mouseleave', () => {
        scheduleEnd();
      });
    });

    return {
      dayHour,
      dayHalfHour,
      weekName,
      ...toRefs(state),
      calendarRef,
      scheduleRef,
      popoverRef,
      onMousedown,
      onMouseenter,
      onMouseleave,
      onResetAllClick,
    };
  },
});
</script>
