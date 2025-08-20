import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-white via-slate-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 backdrop-blur-xl">
      {/* Main Content */}
      <div className="relative px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
            {/* Developer Credits */}
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center">
              <span className="text-muted-foreground">Developed by</span>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Link
                  href="https://www.linkedin.com/in/mrugeshthesiya/"
                  target="_blank"
                  className="group relative px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/50 dark:border-indigo-800/30 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-md hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/30"
                >
                  <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700 dark:group-hover:from-indigo-300 dark:group-hover:to-purple-300 transition-all duration-300">
                    Mrugesh Thesiya
                  </span>
                </Link>

                <span className="hidden sm:inline text-muted-foreground">
                  &
                </span>
                <span className="sm:hidden text-muted-foreground">&</span>

                <Link
                  href="https://www.linkedin.com/in/hiren-kumar-thakkar/"
                  target="_blank"
                  className="group relative px-3 py-1 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200/50 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-md hover:shadow-purple-100/50 dark:hover:shadow-purple-900/30"
                >
                  <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-700 dark:group-hover:from-purple-300 dark:group-hover:to-pink-300 transition-all duration-300">
                    Hiren Kumar Thakkar
                  </span>
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
              <p className="text-muted-foreground font-medium">
                © {currentYear}{" "}
                <span className="bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent font-bold">
                  PDEU
                </span>
                . All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;