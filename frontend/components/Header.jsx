export default function Header() {
  return (
    <header className="flex justify-between items-center h-6 w-full px-2 font-vend  tracking-[-6%] ">
      <button className="font-extrabold text-[2rem] leading-[95%] ">
        Heisenberg
      </button>
      <div className="flex items-center gap-3 text-[1.2rem] h-full">
        <button>page1</button>
        <button>page2</button>
        <button>page3</button>

        <button className="h-full w-10 bg-accent-foreground rounded-[5px] ml-2 text-white text-[1rem] select-none text-center">
          AC
        </button>
      </div>
    </header>
  );
}
