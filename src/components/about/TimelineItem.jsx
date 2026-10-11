"use client";

export default function TimelineItem({ roles, company, period, current }) {
  return (
    <div className="relative pl-8 md:pl-12">
      <span aria-hidden="true" className="absolute left-2 md:left-0 top-[1.125rem] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500" />
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
        {company}
      </h3>
      <p className="text-orange-500 font-semibold mb-6">{period}</p>

      <ol className="pl-5">
        {roles.map((role, roleIndex) => (
          <li key={role} className="relative pb-5 last:pb-0">
            {roleIndex < roles.length - 1 && (
              <span aria-hidden="true" className="absolute -left-5 top-3.5 bottom-[-0.875rem] w-px -translate-x-1/2 bg-white/15" />
            )}
            <span aria-hidden="true" className={`absolute -left-5 top-3.5 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${roleIndex === 0 ? "bg-orange-500" : "bg-white/40"}`} />
            <div className="flex flex-wrap items-center gap-3">
              <h4 className={`text-lg md:text-xl ${roleIndex === 0 ? "font-semibold text-white" : "text-white/60"}`}>
                {role}
              </h4>
              {current && roleIndex === 0 && (
                <span className="rounded-full border border-orange-500/30 px-2.5 py-0.5 text-xs font-medium text-orange-500">
                  Current role
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
