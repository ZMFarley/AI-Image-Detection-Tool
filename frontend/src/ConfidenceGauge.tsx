import { Pie, PieChart, Tooltip } from 'recharts';
import type {PieProps} from 'recharts';


//Props to handle prediction information 
type ConfidenceGaugeProps = {
    probReal: number;
    probAI: number;
};

const ConfidencePie = (props: PieProps) => (
    <Pie
        {...props}
        stroke="none"
        dataKey="value"
        startAngle={180}
        endAngle={0}
        cx={170}
        cy={165}
        innerRadius={125}
        outerRadius={160}
        paddingAngle={2}
        cornerRadius={12}
    />
    );
    
export default function ConfidenceGauge({probReal, probAI}: ConfidenceGaugeProps) {
    // Prediction Data to occupy the chart 
    const predictionConfidences = [
    { name: 'A', value: probAI, fill: 'red' },
    { name: 'B', value: probReal, fill: 'green' }
    
    ];

        return (
        <>
            <PieChart width={350} height={200} style={{ margin: '0 auto' }}>
            <ConfidencePie data={predictionConfidences} isAnimationActive={true} />
            <Tooltip defaultIndex={0} content={() => null} active />
            </PieChart>
            <div className="gauge-labels">
                <div className="gauge-label" style={{color: "#B22222"}}>
                    <span>AI</span>
                    <strong>{probAI.toFixed(2)}%</strong>
                </div>

                <div className="gauge-label" style={{color: "#228B22"}}>
                    <span>Real</span>
                    <strong>{probReal.toFixed(2)}%</strong>
                </div>
            </div>
        </>
    );
}