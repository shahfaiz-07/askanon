import Link from 'next/link';
import React from 'react'

const Footer = () => {
  return (
      <div className="flex flex-col gap-5 md:flex-row p-5 justify-between text-xs dark:text-gray-400">
          <div className="flex flex-col">
              <p>AskAnon - Ask Anyone, Anything, Anonymously</p>
              <p>
                  Need help? Contact us or give your valuable feedback{" "}
                  <Link href={"/contact-us"} className='text-blue-600'>here.</Link>
              </p>
          </div>
          <div className="flex flex-col">
              <p>© 2025 AskAnon. All rights reserved.</p>
              <p>Made with ❤️, by S Faizaan Hussain.</p>
          </div>
      </div>
  );
}

export default Footer