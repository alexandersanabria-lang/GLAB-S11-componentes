"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/cards/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";

const cssModulesUses = [
  "Animaciones complejas (onda, shake, spin)",
  "Pseudo-elementos (::before, ::after)",
  "Gradientes avanzados con sombras",
  "Keyframe animations personalizadas",
  "Labels flotantes con transiciones",
];

const tailwindUses = [
  "Layout y grid system",
  "Colores y backgrounds",
  "Spacing (padding, margin)",
  "Responsive design (sm:, md:, lg:)",
  "Hover y estados simples",
];

export default function LabPage() {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
      alert("¡Acción completada!");
    }, 2000);
  };

  const validateEmail = (value: string) => {
    setEmail(value);
    if (value && !value.includes("@")) {
      setEmailError("Email inválido");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!emailError && name && email) {
      alert(`Formulario enviado:\nNombre: ${name}\nEmail: ${email}`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-800">
            Componentes Reutilizables
          </h1>
          <p className="text-xl text-gray-600">CSS Modules + Tailwind CSS</p>
        </div>

        {/* Sección 1: Buttons */}
        <Card
          title="1. Botones con CSS Modules"
          subtitle="Efectos complejos usando CSS Modules para animaciones personalizadas"
          className="mb-8"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">
                Small Primary
              </Button>
              <Button variant="secondary" size="md">
                Medium Secondary
              </Button>
              <Button variant="outline" size="lg">
                Large Outline
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                loading={buttonLoading}
                onClick={handleButtonClick}
              >
                {buttonLoading ? "Cargando" : "Click para cargar"}
              </Button>
              <Button variant="secondary" disabled>
                Disabled Button
              </Button>
              <Button variant="primary" fullWidth>
                Full Width Button
              </Button>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>CSS Modules usado para:</strong> Efecto de onda al
                click, animación de loading, gradientes complejos, transiciones
                hover
              </p>
            </div>
          </div>
        </Card>

        {/* Sección 2: Badges */}
        <Card
          title="2. Badges con Tailwind"
          subtitle="Componentes simples usando solo clases utilitarias de Tailwind"
          className="mb-8"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="neutral">Neutral</Badge>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="success" size="sm" rounded>
                Small
              </Badge>
              <Badge variant="error" size="md" rounded>
                Medium
              </Badge>
              <Badge variant="warning" size="lg" rounded>
                Large
              </Badge>
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-800">
                <strong>Tailwind usado para:</strong> Colores, tamaños, bordes,
                espaciado - todo con clases utilitarias
              </p>
            </div>
          </div>
        </Card>

        {/* Sección 3: Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card title="Card Simple" subtitle="Solo con Tailwind" hover={true}>
            <p>
              Este card usa únicamente Tailwind CSS para todos sus estilos.
              Perfecto para componentes estándar.
            </p>
          </Card>

          <Card
            title="Card con Imagen"
            image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400"
            footer={
              <div className="flex items-center justify-between">
                <Badge variant="info" size="sm">
                  Desarrollo
                </Badge>
                <span className="text-sm text-gray-500">Hace 2 horas</span>
              </div>
            }
          >
            <p>Imagen con efecto hover y footer personalizado.</p>
          </Card>

          <Card
            title="Card Interactivo"
            subtitle="Con acciones"
            footer={
              <Button variant="primary" size="sm" fullWidth>
                Ver más
              </Button>
            }
          >
            <p className="mb-3">Card con botón de acción en el footer.</p>
            <div className="flex gap-2">
              <Badge variant="success" size="sm">
                React
              </Badge>
              <Badge variant="info" size="sm">
                Next.js
              </Badge>
            </div>
          </Card>
        </div>

        {/* Sección 4: Formulario con Inputs */}
        <Card
          title="3. Formulario con Inputs (Combinación)"
          subtitle="CSS Modules para animaciones + Tailwind para estructura"
          className="mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre completo"
              value={name}
              onChange={setName}
              required
              helperText="Ingresa tu nombre y apellido"
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={validateEmail}
              error={emailError}
              required
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />

            <Button type="submit" variant="primary" fullWidth>
              Enviar Formulario
            </Button>

            <div className="mt-4 rounded-lg bg-purple-50 p-4">
              <p className="text-sm text-purple-800">
                <strong>Combinación efectiva:</strong> CSS Modules para label
                flotante, animación de error y efectos de focus. Tailwind para
                layout, colores y responsive.
              </p>
            </div>
          </form>
        </Card>

        {/* Comparación final */}
        <Card title="Resumen de Técnicas Usadas" className="mb-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-3 text-lg font-bold text-purple-600">
                CSS Modules
              </h4>
              <ul className="space-y-2 text-sm">
                {cssModulesUses.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-purple-500">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-bold text-blue-600">
                Tailwind CSS
              </h4>
              <ul className="space-y-2 text-sm">
                {tailwindUses.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}