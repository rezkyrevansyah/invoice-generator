const STEPS = [
  { label: 'Info Dokumen' },
  { label: 'Info Client' },
  { label: 'Detail Project' },
  { label: 'Pembayaran' },
];

export default function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="stepper flex items-center w-full mb-8">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={stepNumber} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold border-2 flex-shrink-0"
                style={
                  isActive
                    ? { backgroundColor: '#0F6E56', borderColor: '#0F6E56', color: '#fff' }
                    : isDone
                    ? { backgroundColor: '#0F6E56', borderColor: '#0F6E56', color: '#fff' }
                    : { backgroundColor: '#fff', borderColor: '#d1d5db', color: '#9ca3af' }
                }
              >
                {isDone ? '✓' : stepNumber}
              </div>
              <span
                className="mt-1 text-xs text-center whitespace-nowrap hidden sm:block"
                style={
                  isActive
                    ? { color: '#0F6E56', fontWeight: 600 }
                    : isDone
                    ? { color: '#085041' }
                    : { color: '#9ca3af' }
                }
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 mb-5"
                style={{ backgroundColor: isDone ? '#0F6E56' : '#e5e7eb' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
