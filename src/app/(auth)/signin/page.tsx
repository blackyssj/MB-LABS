"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn, Shield, BarChart3, Clock } from "lucide-react";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session as any)?.role;
      const first = (session as any)?.clientIds?.[0];
      if (role === "admin") router.replace("/admin/clients");
      else if (first) router.replace(`/dashboard/${first}`);
      else router.replace("/");
    }
  }, [status, session, router]);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px, 40px 40px",
        }}
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
        {/* Left: Brand / value prop */}
        <section className="hidden lg:flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide">
              <Shield className="h-3.5 w-3.5" />
              Seguridad empresarial
            </div>
            <h1 className="text-4xl font-semibold leading-tight">
              MB Dashboards
            </h1>
            <p className="mt-4 text-slate-300">
              Automatización contable y analítica financiera en tiempo real. Accedé a KPIs, conciliaciones y reportes listos para tu equipo.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <BarChart3 className="mt-0.5 h-5 w-5" />
                Indicadores claros para decisiones rápidas.
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5" />
                Procesos automáticos que ahorran horas operativas.
              </li>
              <li className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5" />
                Acceso seguro y segmentado por cliente.
              </li>
            </ul>
          </motion.div>
        </section>

        {/* Right: Auth card */}
        <section className="flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md"
          >
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur xl:p-10">
              {/* Logo / Title */}
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 font-bold">
                  MB
                </div>
                <div>
                  <h2 className="text-xl font-semibold leading-tight">
                    Acceso a MB Dashboards
                  </h2>
                  <p className="text-sm text-slate-300">Iniciá sesión para continuar</p>
                </div>
              </div>

              {/* Sign in button */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/post-login" })}
                className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-medium text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
              >
                <LogIn className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                Continuar con Google
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
                <div className="h-px flex-1 bg-white/10" />
                o
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Help / legal */}
              <div className="space-y-3 text-xs text-slate-400">
                <p>
                  Al continuar aceptás nuestras <a href="#" className="underline decoration-dotted underline-offset-2 hover:text-slate-200">Políticas de Privacidad</a> y
                  <a href="#" className="ml-1 underline decoration-dotted underline-offset-2 hover:text-slate-200">Términos</a>.
                </p>
                <p>
                  ¿Problemas para ingresar? <a href="#" className="underline decoration-dotted underline-offset-2 hover:text-slate-200">Contactá soporte</a>.
                </p>
              </div>
            </div>

            {/* Footer brand */}
            <p className="mt-6 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} MB Labs · Moreno Baldivieso · Automatización Contable
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
