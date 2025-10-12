import React from 'react';
import { Label } from './label';
import { Slider } from './slider';
import { Switch } from './switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface ControlPanelProps {
  config: {
    pauseOnHover: boolean;
    cardDistance: number;
    verticalDistance: number;
    delay: number;
    skewAmount: number;
    easing: 'elastic' | 'linear' | 'power1';
  };
  onConfigChange: (key: string, value: any) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onConfigChange,
}) => {
  return (
    <div className="bg-background/95 backdrop-blur-md rounded-xl p-6 shadow-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
      <h3 className="text-lg font-semibold mb-6 text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">Animation Controls</h3>

      <div className="space-y-6">
        {/* Pause on Hover */}
        <div className="flex items-center justify-between">
          <Label htmlFor="pause-hover" className="text-sm font-medium">
            Pause on Hover
          </Label>
          <Switch
            id="pause-hover"
            checked={config.pauseOnHover}
            onCheckedChange={(checked) => onConfigChange('pauseOnHover', checked)}
          />
        </div>

        {/* Card Distance */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Card Distance: {config.cardDistance}px
          </Label>
          <Slider
            value={[config.cardDistance]}
            onValueChange={(value) => onConfigChange('cardDistance', value[0])}
            min={20}
            max={150}
            step={5}
            className="w-full"
          />
        </div>

        {/* Vertical Distance */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Vertical Distance: {config.verticalDistance}px
          </Label>
          <Slider
            value={[config.verticalDistance]}
            onValueChange={(value) => onConfigChange('verticalDistance', value[0])}
            min={20}
            max={150}
            step={5}
            className="w-full"
          />
        </div>

        {/* Delay */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Delay: {config.delay}ms
          </Label>
          <Slider
            value={[config.delay]}
            onValueChange={(value) => onConfigChange('delay', value[0])}
            min={1000}
            max={10000}
            step={500}
            className="w-full"
          />
        </div>

        {/* Skew Amount */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Skew Amount: {config.skewAmount}°
          </Label>
          <Slider
            value={[config.skewAmount]}
            onValueChange={(value) => onConfigChange('skewAmount', value[0])}
            min={0}
            max={20}
            step={1}
            className="w-full"
          />
        </div>

        {/* Easing */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Easing</Label>
          <Select
            value={config.easing}
            onValueChange={(value) => onConfigChange('easing', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elastic">Elastic</SelectItem>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="power1">Power1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};