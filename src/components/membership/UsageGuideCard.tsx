type UsageGuideCardProps = {
  items: string[];
  title?: string;
};

const UsageGuideCard = ({
  items,
  title = "이용권 사용 안내",
}: UsageGuideCardProps) => (
  <section className="rounded-[12px] border border-[#e6eaed] bg-neutral-white px-3.5 py-3.5">
    <h3 className="text-12px font-bold leading-[1.5] text-neutral-gray-3">
      {title}
    </h3>
    <ul className="mt-1 flex flex-col">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-0.5">
          <span
            className="shrink-0 text-12px font-normal leading-[1.4] text-neutral-gray-3"
            aria-hidden
          >
            ∙
          </span>
          <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
            {item}
          </p>
        </li>
      ))}
    </ul>
  </section>
);

export default UsageGuideCard;
