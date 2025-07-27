# 🖨️ Price Printer

**Price Printer** es una aplicación web desarrollada en React que permite gestionar productos y generar etiquetas de precios listas para imprimir. Está orientada a negocios que desean mantener una lista de productos actualizada con facilidad y generar etiquetas en formato PDF con diferentes opciones de visualización.

## 🚀 Características principales

- 📂 Carga de productos mediante archivo JSON
- 📝 Edición inline de nombre, descripción y precios
- 🗑️ Eliminación de productos con confirmación y persistencia
- 💾 Guardado automático en `localStorage`
- 🧾 Generación de etiquetas en PDF:
  - Formato completo (1 etiqueta por fila)
  - Formato media hoja (2 etiquetas por fila)
- 🔍 Filtro en tiempo real por nombre
- ✅ Soporte para precios de lista, contado y oferta
- 💡 Precios formateados como moneda en pesos argentinos

## 🖼️ Vista general

La aplicación permite cargar o agregar productos, visualizarlos en una tabla editable y generar etiquetas con diseño claro y profesional. Las etiquetas incluyen:

- ✅ Nombre del producto (máx. 20 caracteres)
- ✅ Descripción truncada (máx. 40 caracteres)
- ✅ SKU como identificador
- ✅ Precio de lista, contado y oferta (con tachado del precio anterior si aplica)

## 📦 Estructura del proyecto

```
src/
├── assets/
│   └── logo.ts           # Logo en base64 para las etiquetas
├── components/
│   ├── AgregarItemModal.tsx
│   ├── EliminarItemModal.tsx
│   ├── ItemTable.tsx
│   ├── UploadJson.tsx
├── pages/
│   └── index.tsx         # Página principal de la app
├── utils/
│   ├── generarPDF.ts
│   └── generarPDFHalf.ts
```

## ⚙️ Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/RodriguezMatias/price-printer.git

# Ingresar al directorio del proyecto
cd price-printer

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## 🧪 Formato esperado del archivo JSON

```json
{
  "nombreNegocio": "Punto Mueble",
  "descripcion": "Mueblería especializada en madera",
  "items": [
    {
      "sku": "1",
      "nombre": "Mesa 1.20 x 0.80",
      "descripcion": "Madera maciza, terminación lustre natural",
      "precioLista": 100000,
      "precioContado": 90000,
      "precioOferta": 85000,
      "modificado": "2024-01-01T00:00:00.000Z",
      "creado": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

⚠️ El campo `items` debe contener un array con objetos que cumplan con la estructura indicada.

## 📤 Exportación

Los productos editados pueden exportarse en formato JSON para respaldo o reutilización.

## 🛠️ Tecnologías utilizadas

- **React + TypeScript**
- **jsPDF** para generar los PDFs
- **HTML5 & CSS3**
- **LocalStorage** para persistencia en el navegador

## ✅ Próximas mejoras

- [x] Precio anterior tachado
- [ ] Modo oscuro
- [ ] Reordenamiento de columnas
- [ ] Persistencia en backend (opcional)
- [ ] Subida y descarga desde nube (Google Drive, Dropbox, etc.)

## 🧪 Testing

Este proyecto utiliza [Vitest](https://vitest.dev/) junto con [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) para realizar pruebas automatizadas.

### 📦 Instalación de dependencias de testing

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

> Asegurate también de tener `setupTests.ts` en `src/` con la siguiente línea para extender las aserciones:
>
> ```ts
> import '@testing-library/jest-dom';
> ```

### ▶️ Ejecutar los tests con UI

```bash
npx vitest --ui
```

### ✅ Ejecutar los tests en consola

```bash
npx vitest run
```

## 📊 Reporte de cobertura

Para verificar la cobertura de código del proyecto:

### 🧪 Paso 1: Configuración en `vite.config.ts`

```ts
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    reportsDirectory: './coverage',
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
  },
}
```

### 🧪 Paso 2: Ejecutar la cobertura

```bash
npx vitest run --coverage
```

Esto genera un resumen en consola y un reporte HTML en `./coverage/index.html`. Podés abrirlo directamente con:

```bash
npx open-cli coverage/index.html
```

También podés configurar scripts en `package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:coverage": "vitest run --coverage",
  "open:coverage": "open-cli coverage/index.html"
}
```

## 🙌 Autor

Desarrollado por [Matías Rodríguez](https://github.com/RodriguezMatias)

---