import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  subTitle,
  extra,
  onBack,
  className,
  children,
}) {
  return (
    <div className={cn('mb-4 rounded-lg border border-[var(--outline)] bg-white p-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="mb-2 text-xs text-[var(--primary)]"
            >
              Back
            </button>
          ) : null}
          {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
          {subTitle ? <p className="text-sm text-[var(--on-surface-muted)]">{subTitle}</p> : null}
        </div>
        {extra ? <div className="flex items-center gap-2">{extra}</div> : null}
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

export default {
  PageHeader,
};

