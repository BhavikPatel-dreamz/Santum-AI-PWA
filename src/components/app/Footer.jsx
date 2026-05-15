export default function Footer() {
  return (
    <footer className="w-full font-satoshi bg-[#323D51] px-6 py-8 items-center flex flex-col gap-8 md:px-12 lg:px-24 xl:px-32">
      
      {/* Professional Care Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[#dedede] text-sm font-semibold uppercase tracking-wide">
          For Professional Care
        </h2>
        <a
          href="https://santum.net"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-max bg-orange-400 text-white px-8 py-3 rounded-2xl font-medium hover:opacity-90 transition-opacity duration-200"
        >
          Visit Santum.net
        </a>
      </div>

      {/* Emergency Lines Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[#dedede] text-sm font-semibold uppercase tracking-wide text-center">
          Emergency Lines
        </h2>
        {/* Using your global muted text color #93A099 for the dark background */}
        <div className="flex flex-col gap-2 text-[#93A099] text-sm sm:text-base">
          <p>
            Police & Trauma Line:{' '}
            <a href="tel:0800205026" className="hover:text-white transition-colors">
              0800205026
            </a>
          </p>
          <p>
            Suicide Crisis Line:{' '}
            <a href="tel:0800567567" className="hover:text-white transition-colors">
              0800567567
            </a>
          </p>
          <p>
            Psychiatric Response Unit:{' '}
            <a href="tel:0861435787" className="hover:text-white transition-colors">
              0861435787
            </a>
          </p>
        </div>
      </div>
      
    </footer>
  );
}
