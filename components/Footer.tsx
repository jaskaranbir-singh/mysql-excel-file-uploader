"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp, Store, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

type FooterProps = {
  developerUrl: string;
  developerLabel: string;
};

const Footer = ({ developerUrl, developerLabel }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        className=" border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
      >
        <div className="text-foreground/60 text-sm">
          &copy; {currentYear}{" "}
          <a
            href={developerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label={`Visit ${developerLabel}'s profile`}
          >
            {developerLabel}
          </a>
          . All rights reserved.
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToTop}
            className="rounded-full bg-primary/10 hover:bg-primary/20 hover:text-primary transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </Button>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
