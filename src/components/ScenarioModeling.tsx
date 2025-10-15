import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ScenarioData {
  baseline: {
    occupancy: number;
    adr: number;
    projectedRevenue: number;
  };
}

export const ScenarioModeling = () => {
  const [baseline, setBaseline] = useState<ScenarioData['baseline']>({ occupancy: 85.3, adr: 12850, projectedRevenue: 3570000 });
  const [occupancyAdj, setOccupancyAdj] = useState(0);
  const [adrAdj, setAdrAdj] = useState(0);
  const [projectedRevenue, setProjectedRevenue] = useState(3570000);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    axios.get('/data/scenario.json').then(res => {
      setBaseline(res.data.baseline);
      setProjectedRevenue(res.data.baseline.projectedRevenue);
    });
  }, []);

  const calculatePreview = () => {
    const newOccupancy = baseline.occupancy * (1 + occupancyAdj / 100);
    const newAdr = baseline.adr * (1 + adrAdj / 100);
    return Math.round((baseline.projectedRevenue / (baseline.occupancy * baseline.adr)) * newOccupancy * newAdr);
  };

  const handleApply = () => {
    const newRevenue = calculatePreview();
    setProjectedRevenue(newRevenue);
    setIsApplied(true);
  };

  const handleReset = () => {
    setOccupancyAdj(0);
    setAdrAdj(0);
    setProjectedRevenue(baseline.projectedRevenue);
    setIsApplied(false);
  };

  const previewRevenue = calculatePreview();
  const currentRevenue = isApplied ? projectedRevenue : baseline.projectedRevenue;
  const revenueDiff = previewRevenue - currentRevenue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Scenario Modeling</h3>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Occupancy Adjustment</label>
                <span className="text-sm text-muted-foreground">
                  {occupancyAdj > 0 ? '+' : ''}{occupancyAdj}%
                </span>
              </div>
              <Slider
                value={[occupancyAdj]}
                onValueChange={(val) => setOccupancyAdj(val[0])}
                min={-20}
                max={20}
                step={1}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">ADR Adjustment</label>
                <span className="text-sm text-muted-foreground">
                  {adrAdj > 0 ? '+' : ''}{adrAdj}%
                </span>
              </div>
              <Slider
                value={[adrAdj]}
                onValueChange={(val) => setAdrAdj(val[0])}
                min={-20}
                max={20}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Revenue</span>
              <span className="font-semibold">₹{currentRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2 mt-2">
              <span className="text-muted-foreground">Projected Preview</span>
              <span className={`font-bold ${occupancyAdj !== 0 || adrAdj !== 0 ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}>
                ₹{previewRevenue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Impact</span>
              <span className={`font-semibold ${revenueDiff >= 0 ? 'text-success' : 'text-error'}`}>
                {revenueDiff >= 0 ? '+' : ''}₹{revenueDiff.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleApply} className="flex-1 bg-primary text-primary-foreground">
              Apply Scenario
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
