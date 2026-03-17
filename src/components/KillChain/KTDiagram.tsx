import { useState } from 'react';
import { ktKillChain, type KTStep } from '../../data/kt-killchain';
import { StepNode } from './StepNode';
import { AttackArrow } from './AttackArrow';
import { DetailPanel } from './DetailPanel';

interface KTDiagramProps {
  isStepBlocked: (defenseIds: string[]) => boolean;
}

export function KTDiagram({ isStepBlocked }: KTDiagramProps) {
  const [selectedStep, setSelectedStep] = useState<KTStep | null>(null);

  const pathA = ktKillChain.filter(s => s.path === 'A');
  const pathB = ktKillChain.filter(s => s.path === 'B');

  const firstBlockedA = pathA.findIndex(s => isStepBlocked(s.defenseIds));
  const firstBlockedB = pathB.findIndex(s => isStepBlocked(s.defenseIds));

  const renderPath = (steps: KTStep[], firstBlocked: number, pathLabel: string) => (
    <div className="flex flex-col lg:flex-row items-center justify-center">
      {steps.map((step, i) => {
        const blocked = isStepBlocked(step.defenseIds);
        const isDownstreamBlocked = firstBlocked !== -1 && i > firstBlocked;

        return (
          <div key={step.id} className="flex flex-col lg:flex-row items-center">
            <StepNode
              step={step}
              index={i}
              blocked={blocked}
              isDownstreamBlocked={isDownstreamBlocked}
              onClick={() => setSelectedStep(selectedStep?.id === step.id ? null : step)}
              isSelected={selectedStep?.id === step.id}
              pathLabel={i === 0 ? pathLabel : undefined}
            />
            {i < steps.length - 1 && (
              <>
                <div className="hidden lg:block">
                  <AttackArrow blocked={blocked || isDownstreamBlocked} />
                </div>
                <div className="block lg:hidden">
                  <AttackArrow blocked={blocked || isDownstreamBlocked} vertical />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative space-y-8">
      <div className="border border-slate-700/50 rounded-lg p-6 bg-slate-900/20">
        <div className="font-mono-custom text-xs text-red-400 mb-4 tracking-wider">
          ⚡ 경로 A — 서버 해킹 (Server Breach)
        </div>
        {renderPath(pathA, firstBlockedA, 'A')}
      </div>

      <div className="border border-slate-700/50 rounded-lg p-6 bg-slate-900/20">
        <div className="font-mono-custom text-xs text-amber-400 mb-4 tracking-wider">
          📡 경로 B — 펨토셀 해킹 (Femtocell Attack)
        </div>
        {renderPath(pathB, firstBlockedB, 'B')}
      </div>

      <DetailPanel step={selectedStep} onClose={() => setSelectedStep(null)} />
    </div>
  );
}
