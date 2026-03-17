import { useState } from 'react';
import { sktKillChain, type KillChainStep } from '../../data/skt-killchain';
import { StepNode } from './StepNode';
import { AttackArrow } from './AttackArrow';
import { DetailPanel } from './DetailPanel';

interface SKTDiagramProps {
  isStepBlocked: (defenseIds: string[]) => boolean;
}

export function SKTDiagram({ isStepBlocked }: SKTDiagramProps) {
  const [selectedStep, setSelectedStep] = useState<KillChainStep | null>(null);

  // Find first blocked step index
  const firstBlockedIndex = sktKillChain.findIndex(s => isStepBlocked(s.defenseIds));

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-0 py-8">
        {sktKillChain.map((step, i) => {
          const blocked = isStepBlocked(step.defenseIds);
          const isDownstreamBlocked = firstBlockedIndex !== -1 && i > firstBlockedIndex;

          return (
            <div key={step.id} className="flex flex-col lg:flex-row items-center">
              <StepNode
                step={step}
                index={i}
                blocked={blocked}
                isDownstreamBlocked={isDownstreamBlocked}
                onClick={() => setSelectedStep(selectedStep?.id === step.id ? null : step)}
                isSelected={selectedStep?.id === step.id}
              />
              {i < sktKillChain.length - 1 && (
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

      <DetailPanel step={selectedStep} onClose={() => setSelectedStep(null)} />
    </div>
  );
}
