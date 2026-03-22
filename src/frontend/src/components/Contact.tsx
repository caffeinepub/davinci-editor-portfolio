import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiInstagram, SiLinkedin, SiX, SiYoutube } from "react-icons/si";
import { toast } from "sonner";
import { useSubmitContactForm } from "../hooks/useQueries";

const SOCIALS = [
  {
    icon: SiYoutube,
    label: "YouTube",
    href: "https://youtube.com",
    color: "var(--color-amber)",
  },
  {
    icon: SiX,
    label: "Twitter / X",
    href: "https://x.com",
    color: "var(--color-amber)",
  },
  {
    icon: SiInstagram,
    label: "Instagram",
    href: "https://instagram.com",
    color: "var(--color-teal)",
  },
  {
    icon: SiLinkedin,
    label: "LinkedIn",
    href: "https://linkedin.com",
    color: "var(--color-teal)",
  },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { mutate: submit, isPending } = useSubmitContactForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    submit(
      { name, email, message },
      {
        onSuccess: () => {
          toast.success("Message sent! I'll get back to you soon.");
          setName("");
          setEmail("");
          setMessage("");
        },
        onError: () => {
          toast.error("Something went wrong. Please try again.");
        },
      },
    );
  };

  return (
    <section
      id="contact"
      className="py-24 px-6"
      style={{ background: "#1a1a1a" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            Get In Touch
          </h2>
          <div
            className="h-1 w-16 rounded-full mx-auto mb-4"
            style={{ background: "var(--color-amber)" }}
          />
          <p className="text-base" style={{ color: "#a3a3a3" }}>
            Available for freelance projects and collaborations.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-5"
          data-ocid="contact.panel"
        >
          <div>
            <Label
              htmlFor="contact-name"
              className="text-sm font-medium mb-2 block"
              style={{ color: "#a3a3a3" }}
            >
              Name
            </Label>
            <Input
              id="contact-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="border-[#3d3d3d] focus:border-[#f59e0b] focus-visible:ring-[#f59e0b]/30 text-[#e5e5e5] placeholder:text-[#4a4a4a]"
              style={{ background: "var(--color-surface)" }}
              data-ocid="contact.input"
            />
          </div>
          <div>
            <Label
              htmlFor="contact-email"
              className="text-sm font-medium mb-2 block"
              style={{ color: "#a3a3a3" }}
            >
              Email
            </Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="border-[#3d3d3d] focus:border-[#f59e0b] focus-visible:ring-[#f59e0b]/30 text-[#e5e5e5] placeholder:text-[#4a4a4a]"
              style={{ background: "var(--color-surface)" }}
              data-ocid="contact.input"
            />
          </div>
          <div>
            <Label
              htmlFor="contact-message"
              className="text-sm font-medium mb-2 block"
              style={{ color: "#a3a3a3" }}
            >
              Message
            </Label>
            <Textarea
              id="contact-message"
              placeholder="Tell me about your project..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="border-[#3d3d3d] focus:border-[#f59e0b] focus-visible:ring-[#f59e0b]/30 text-[#e5e5e5] placeholder:text-[#4a4a4a] resize-none"
              style={{ background: "var(--color-surface)" }}
              data-ocid="contact.textarea"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full font-bold tracking-wider uppercase py-6 rounded-sm hover:opacity-90 transition-opacity"
            style={{ background: "var(--color-amber)", color: "#0f0f0f" }}
            data-ocid="contact.submit_button"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Send Message
              </>
            )}
          </Button>
          {isPending && (
            <div
              data-ocid="contact.loading_state"
              className="text-center text-sm"
              style={{ color: "#a3a3a3" }}
            >
              Sending your message...
            </div>
          )}
        </motion.form>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center gap-6"
        >
          {SOCIALS.map(({ icon: Icon, label, href, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#3d3d3d] hover:border-[#f59e0b] hover:scale-110 transition-all duration-200"
              style={{ color }}
              data-ocid="contact.link"
            >
              <Icon size={18} />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
