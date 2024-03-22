'use client'
import Chart from 'chart.js/auto';
import {checkBSOR} from '@/lib/bsorDecoder'
import { BSOR, BSORNote } from '@/types/beatleaderScore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { processAccGraphs, processAccuracySpread, processUnderswings } from '@/lib/bsorReplayAcc';
import { createDistanceWeightFunction, createMinMaxCounter } from '@/lib/beatleader';
import getStatistic from '@/lib/stastic';
import { Datum } from '@/types/beatleaderreq';


export function formatNumber(num:number, digits = 2, addSign = false, notANumber = null) {
	if (!Number.isFinite(num)) {
		return notANumber;
	}

	return (
		(addSign && num > 0 ? '+' : '') +
		num.toLocaleString(navigator.language, {
			minimumFractionDigits: digits,
			maximumFractionDigits: digits,
		})
	);
}

function timeToLabel(time:any) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return minutes + ':' + seconds.toString().padStart(2, '0');
}

function processChartData(chartData:any, resolution:any, smoothPeriodPercentage:any, weightFunctionSteepness:any) {
    var data = [] as any[];
    if (chartData.length === 0 || resolution === 0) return data;

    var songDuration = chartData[chartData.length - 1][1];
    const distanceWeightFunction = createDistanceWeightFunction(songDuration * smoothPeriodPercentage, weightFunctionSteepness);

    for (let i = 0.0; i < resolution; i += 1.0) {
        const songTime = (songDuration * i) / (resolution - 1);

        var sum = 0;
        var divider = 0;

        for (let j = 0.0; j < chartData.length; j += 1.0) {
            const item = chartData[j];
            const weight = distanceWeightFunction.getWeight(item[1] - songTime);

            sum += item[0] * weight;
            divider += weight;
        }

        if (divider === 0) continue;
        const value = 100 + (sum / divider) * 15;
        data.push(value);
    }

    return data;
}
export default function ScoreGraph(
{
    scoreId,
    scoreInfo
}:{
    scoreId: number,
    scoreInfo: Datum
}
) {
    console.log("scoreInfo",scoreInfo)
    const [times, setTimes] = useState(0)
    // const [beatSavior ,setBeatSavior] = useState<any>(null)
    const [notes,setNotes] = useState<BSORNote[]>([])
    const canvas = useRef(null)
    const [chart,setChart] = useState<any>(null)
    const setupChart = useCallback((canvas:any, chartData:any, underswingsData:any, beatSavior:any) => {
		if (!canvas || !chartData || !Object.keys(chartData).length) return;

		const title =
			underswingsData?.noUnderswingsScore > underswingsData?.score
				? `Lost by underswings: ${formatNumber(underswingsData.noUnderswingsScore - underswingsData.score, 0)}pts, ${formatNumber(
						underswingsData.noUnderswingsAcc - underswingsData.acc,
						2
				  )}% acc` +
				  (underswingsData?.noUnderswingsPp && underswingsData?.noUnderswingsPp > underswingsData?.pp
						? `, ${formatNumber(underswingsData.noUnderswingsPp - underswingsData.pp, 2)}pp`
						: '')
				: null;

		let labels = chartData.times.map(timeToLabel);

		const minMaxCounter = createMinMaxCounter(0, 115, 1.0);

		var hands = [] as any;
		if (beatSavior?.stats?.accLeft) {
			hands.push('red');
		}
		if (beatSavior?.stats?.accRight) {
			hands.push('blue');
		}
		if (hands.length == 2) {
			hands.push('total');
		}

		for (let i = 0; i < chartData.times.length; i++) {
			hands.forEach((saberType:any) => {
				minMaxCounter.update(chartData.realScoreBySaber[saberType][i]);
				minMaxCounter.update(chartData.fullSwingBySaber[saberType][i]);
			});
		}

		var datasets = [] as any[];

		// if (notes) {
		// 	var notesData = processChartData(notes.rows, 100, 0.02, 3);

		// 	for (let i = 0; i < notesData.length; i++) {
		// 		minMaxCounter.update(notesData[i]);
		// 	}

		// 	datasets.push({
		// 		yAxisID: 'score',
		// 		label: 'Predicted',
		// 		data: notesData,
		// 		cubicInterpolationMode: 'monotone',
		// 		tension: 0.4,
		// 		borderColor: '#fe4dfe',
		// 		borderWidth: 1,
		// 		pointRadius: 0,
		// 		type: 'line',
		// 		borderDash: [3, 3],
		// 	});
		// }

		const xAxis = {
			scaleLabel: {
				display: false,
			},
			grid: {
				drawTicks: false,
			},
			ticks: {
				autoSkip: true,
				autoSkipPadding: 4,
				color: 'white',
			},
		};

		const yAxes = {
			score: {
				display: true,
				min: minMaxCounter.minValue,
				max: minMaxCounter.maxValue,
				position: 'left',
				ticks: {
					autoSkipPadding: 12,
					color: 'white',
				},
			},
		};

		if (beatSavior?.stats?.accLeft) {
			datasets.push({
				yAxisID: 'score',
				label: 'Accuracy (left)',
				data: chartData.fullSwingBySaber.red,
				type: 'line',
				borderColor: '#ee5555',
				backgroundColor: '#ee5555',
				borderWidth: 2,
				pointRadius: 0,
				cubicInterpolationMode: 'monotone',
				tension: 0.4,
				spanGaps: true,
				order: 3,
			});
			datasets.push({
				yAxisID: 'score',
				label: 'Underswing (left)',
				data: chartData.realScoreBySaber.red,
				type: 'line',
				fill: '-1',
				borderColor: '#ee555555',
				backgroundColor: '#ee555555',
				borderWidth: 0,
				pointRadius: 0,
				cubicInterpolationMode: 'monotone',
				tension: 0.4,
				spanGaps: true,
				order: 4,
			});
		}

		if (beatSavior?.stats?.accRight) {
			datasets.push({
				yAxisID: 'score',
				label: 'Accuracy (right)',
				data: chartData.fullSwingBySaber.blue,
				type: 'line',
				borderColor: '#5555ee',
				backgroundColor: '#5555ee',
				borderWidth: 2,
				pointRadius: 0,
				cubicInterpolationMode: 'monotone',
				tension: 0.4,
				spanGaps: true,
				order: 5,
			});
			datasets.push({
				yAxisID: 'score',
				label: 'Underswing (right)',
				data: chartData.realScoreBySaber.blue,
				type: 'line',
				fill: '-1',
				borderColor: '#5555ee55',
				backgroundColor: '#5555ee55',
				borderWidth: 0,
				pointRadius: 0,
				cubicInterpolationMode: 'monotone',
				tension: 0.4,
				spanGaps: true,
				order: 6,
			});
		}

		datasets = datasets.concat([
			{
				yAxisID: 'score',
				label: 'Accuracy',
				data: chartData.fullSwingBySaber.total,
				type: 'line',
				borderColor: 'white',
				backgroundColor: 'white',
				borderWidth: 2,
				pointRadius: 0,
				cubicInterpolationMode: 'monotone',
				tension: 0.4,
				spanGaps: true,
				order: 1,
			},
			{
				yAxisID: 'score',
				label: 'Underswing',
				data: chartData.realScoreBySaber.total,
				type: 'line',
				fill: '-1',
				borderColor: '#aaaaaa55',
				backgroundColor: '#aaaaaa55',
				borderWidth: 0,
				pointRadius: 0,
				cubicInterpolationMode: 'monotone',
				tension: 0.4,
				spanGaps: true,
				order: 2,
			},
			{
				yAxisID: 'score',
				label: 'Score',
				data: chartData.realScoreBySaber.total,
				type: 'line',
				borderColor: '#aaaaaa',
				backgroundColor: '#aaaaaa',
				borderWidth: 1,
				pointRadius: 0,
				cubicInterpolationMode: 'monotone',
				tension: 0.4,
				spanGaps: true,
				order: 0,
			},
		]);

		if (!chart) {
			setChart(new Chart(canvas, {
				data: {labels, datasets},

				options: {
					responsive: true,
					maintainAspectRatio: false,
					interaction: {
						mode: 'index',
						intersect: false,
					},
					plugins: {
						legend: {
							display: false,
						},
						title: {
							display: !!title?.length,
							text: title as any,
							color: 'white',
							font: {weight: 'normal'},
							position: 'bottom',
							padding: {top: 5, bottom: 0},
						},
						tooltip: {
							callbacks: {
								title(tooltipItems) {
									const item = tooltipItems[0];
									const labels = item.chart.data.labels as any[];
									return labels[item.dataIndex] + ' (10 seconds average)';
								},
								label(ctx:any) {
									const datasetLabel = ctx.dataset.label;

									let percentage;
									let value;

									switch (datasetLabel) {
										case 'Underswing (left)':
											value = ctx.raw - chartData.fullSwingBySaber.red[ctx.dataIndex];
											percentage = value / 115.0;
											return `${datasetLabel}: ${formatNumber(value, 1)} (${formatNumber(percentage * 100, 2)}%)`;
										case 'Underswing (right)':
											value = ctx.raw - chartData.fullSwingBySaber.blue[ctx.dataIndex];
											percentage = value / 115.0;
											return `${datasetLabel}: ${formatNumber(value, 1)} (${formatNumber(percentage * 100, 2)}%)`;
										case 'Underswing':
											value = ctx.raw - chartData.fullSwingBySaber.total[ctx.dataIndex];
											percentage = value / 115.0;
											return `${datasetLabel}: ${formatNumber(value, 1)} (${formatNumber(percentage * 100, 2)}%)`;
										case 'Score':
											value = ctx.raw;
											percentage = value / 115.0;
											return `${datasetLabel}: ${formatNumber(value, 1)} (${formatNumber(percentage * 100, 2)}%)`;
										default:
											value = ctx.raw;
											percentage = value / 115.0;
											return `${datasetLabel}: ${formatNumber(value - 100.0, 1)} (${formatNumber(percentage * 100, 2)}%)`;
									}
								},
							},
						},
					},
					scales: {
                        x: {
                            ticks: {
                                autoSkip: true,
                                autoSkipPadding: 4,
                                color: 'white',
                            },
                        },
						score: {
                            display: true,
                            min: minMaxCounter.minValue,
                            max: minMaxCounter.maxValue,
                            ticks: {
                                autoSkip: true,
                                autoSkipPadding: 12,
                                color: 'white',
                            },
						}						
					},
				},
			}));
		} else {
            console.log("update")
			chart.data = {labels, datasets};
			if (chart.options.scales.y) {
				chart.options.scales.y.min = minMaxCounter.minValue;
				chart.options.scales.y.max = minMaxCounter.maxValue;
			}
			chart.update();
		}
	},[setChart,chart,canvas])


    const callback = useCallback((savior:any)=>{
        return (v:BSOR) => {
            console.log('call')
            console.log('finish', v)
            console.log('savior',savior)
            // const accData = processAccuracySpread(v)
            const replayAccGraphs = processAccGraphs(v)
            const underswingsData = processUnderswings(v)
            // console.log(accData)
            // replayAccGraphs, underswingsData, notes
            //  {replayAccGraphs} {underswingsData} {beatSavior} {notes}
            setupChart(canvas.current,replayAccGraphs,underswingsData, savior)
            // setOptions(generateOptions(v))
        }
    },[])
    useEffect(()=>{
        setTimes(times+1)
        console.log('call', times)
        async function fetchData() {
            // scoreInfo & scoreId
            const beatSavior = await getStatistic(scoreInfo, scoreId)
            console.log("beatSavior", beatSavior)
            // setBeatSavior(beatSavior)
            // const beatSavior = await getStatistic(scoreId,scoreId)
            checkBSOR(scoreInfo.replay, true, callback(beatSavior))
        }
        fetchData()
        return ()=> {
            
        }
    },[scoreId])
    return (
        <>
            <section style={{height: '12em'}}>
                <canvas className="chartjs" ref={canvas} />
            </section>
        </>
    )

}