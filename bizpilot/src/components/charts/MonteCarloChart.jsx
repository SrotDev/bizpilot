import { Bar } from 'react-chartjs-2'
import { useMemo } from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, annotationPlugin)

export default function MonteCarloChart({ config }) {
  const chartConfig = useMemo(() => {
    if(!config) return null
    const { data, options } = config
    const annotations = options?.plugins?.annotation?.annotations || {}
    return {
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { labels:{ color:'#d1d5db' } },
          title: { display:true, text: options?.plugins?.title?.text || 'Monte Carlo Results', color:'#f3f4f6', font:{ size:14, weight:'600' } },
          annotation: { annotations }
        },
        scales: {
          x: { ticks:{ color:'#9ca3af', maxRotation:45, minRotation:45 }, grid:{ color:'rgba(255,255,255,0.05)' }, title:{ display:true, text: options?.scales?.x?.title?.text, color:'#d1d5db' } },
          y: { ticks:{ color:'#9ca3af' }, grid:{ color:'rgba(255,255,255,0.05)' }, title:{ display:true, text: options?.scales?.y?.title?.text, color:'#d1d5db' }, beginAtZero:true }
        }
      }
    }
  }, [config])

  if(!chartConfig) return null
  return <Bar {...chartConfig} />
}
