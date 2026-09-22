export default function CompoundCard({ 
  name = "Hydrochloric Acid", 
  description = "Some Basic information" 
}) {
  return (
    <div className="h-[320px] w-[240px] bg-[#404D7E] p-2 rounded-[22px] flex flex-col">
      <div className="w-full aspect-square bg-white rounded-[14px]"></div>
      
      <div className="flex flex-col font-vend tracking-[-5%] pt-2 px-1">
        <div className="text-white text-[1.4rem] leading-tight">
          {name}
        </div>
        <div className="text-white/60 text-sm mt-0.5">
          {description}
        </div>
      </div>
    </div>
  );
}