/*
===========================================
LEMALU - FORMULARIO DE CONTACTO
===========================================
Funcionalidad del formulario y validaciones
*/

(function() {
  'use strict';

  // Elementos del DOM
  const form = document.getElementById('contact-form');
  const inputs = form.querySelectorAll('.form-input, .form-textarea');
  const submitBtn = form.querySelector('.form-submit');

  // Estado del formulario
  let isSubmitting = false;

  // Inicializar funcionalidad
  function initContactForm() {
    setupFormValidation();
    setupSubmitHandler();
    setupInputAnimations();
    console.log('📧 Formulario de contacto inicializado');
  }

  // Configurar validación en tiempo real
  function setupFormValidation() {
    inputs.forEach(input => {
      // Validación en tiempo real
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
      
      // Efectos visuales mejorados
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value.trim()) {
          input.parentElement.classList.remove('focused');
        }
      });
    });
  }

  // Validar campo individual
  function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // Limpiar errores previos
    clearFieldError(field);

    // Validaciones específicas
    switch(fieldType) {
      case 'text':
        if (!value) {
          isValid = false;
          errorMessage = 'Este campo es obligatorio';
        } else if (value.length < 2) {
          isValid = false;
          errorMessage = 'Debe tener al menos 2 caracteres';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          isValid = false;
          errorMessage = 'El email es obligatorio';
        } else if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Por favor ingresa un email válido';
        }
        break;

      case 'tel':
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        if (!value) {
          isValid = false;
          errorMessage = 'El teléfono es obligatorio';
        } else if (!phoneRegex.test(value)) {
          isValid = false;
          errorMessage = 'Por favor ingresa un teléfono válido';
        }
        break;

      case 'textarea':
        if (!value) {
          isValid = false;
          errorMessage = 'El mensaje es obligatorio';
        } else if (value.length < 10) {
          isValid = false;
          errorMessage = 'El mensaje debe tener al menos 10 caracteres';
        }
        break;
    }

    // Mostrar error si no es válido
    if (!isValid) {
      showFieldError(field, errorMessage);
    }

    return isValid;
  }

  // Mostrar error en campo
  function showFieldError(field, message) {
    const formGroup = field.parentElement;
    
    // Remover error existente
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Agregar clase de error
    formGroup.classList.add('has-error');
    field.classList.add('error');

    // Crear y mostrar mensaje de error
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      display: block;
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
      opacity: 0;
      transform: translateY(-4px);
      transition: all 0.3s ease;
    `;
    
    formGroup.appendChild(errorElement);
    
    // Animar entrada del error
    requestAnimationFrame(() => {
      errorElement.style.opacity = '1';
      errorElement.style.transform = 'translateY(0)';
    });
  }

  // Limpiar error de campo
  function clearFieldError(field) {
    const formGroup = field.parentElement;
    const errorElement = formGroup.querySelector('.field-error');
    
    if (errorElement) {
      errorElement.style.opacity = '0';
      errorElement.style.transform = 'translateY(-4px)';
      
      setTimeout(() => {
        errorElement.remove();
      }, 300);
    }
    
    formGroup.classList.remove('has-error');
    field.classList.remove('error');
  }

  // Configurar manejador de envío
  function setupSubmitHandler() {
    form.addEventListener('submit', handleSubmit);
  }

  // Manejar envío del formulario
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Validar todos los campos
    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      showFormMessage('Por favor corrige los errores antes de enviar', 'error');
      return;
    }

    // Cambiar estado a enviando
    setSubmittingState(true);

    try {
      // Simular envío (aquí conectarías con tu backend)
      await simulateFormSubmission();
      
      // Éxito
      showFormMessage('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
      resetForm();
      
    } catch (error) {
      // Error
      showFormMessage('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.', 'error');
      console.error('Error al enviar formulario:', error);
    } finally {
      setSubmittingState(false);
    }
  }

  // Simular envío del formulario
  function simulateFormSubmission() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular éxito (90% de probabilidad)
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Error simulado'));
        }
      }, 2000);
    });
  }

  // Cambiar estado del botón de envío
  function setSubmittingState(submitting) {
    isSubmitting = submitting;
    
    if (submitting) {
      submitBtn.innerHTML = `
        <svg style="width: 20px; height: 20px; margin-right: 8px; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2" stroke-dasharray="31.416" stroke-dashoffset="31.416">
            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
          </circle>
        </svg>
        Enviando...
      `;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    } else {
      submitBtn.innerHTML = 'Enviar mensaje';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  }

  // Mostrar mensaje del formulario
  function showFormMessage(message, type) {
    // Remover mensaje existente
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Crear mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
      padding: 16px 20px;
      border-radius: 8px;
      margin-top: 20px;
      font-weight: 500;
      font-size: 14px;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      ${type === 'success' ? 
        'background: rgba(34, 197, 94, 0.1); color: #16a34a; border: 1px solid rgba(34, 197, 94, 0.2);' :
        'background: rgba(239, 68, 68, 0.1); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.2);'
      }
    `;

    form.appendChild(messageElement);

    // Animar entrada
    requestAnimationFrame(() => {
      messageElement.style.opacity = '1';
      messageElement.style.transform = 'translateY(0)';
    });

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-10px)';
        setTimeout(() => messageElement.remove(), 300);
      }
    }, 5000);
  }

  // Resetear formulario
  function resetForm() {
    form.reset();
    inputs.forEach(input => {
      clearFieldError(input);
      input.parentElement.classList.remove('focused');
    });
  }

  // Configurar animaciones de inputs
  function setupInputAnimations() {
    // Agregar estilos dinámicos para errores
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .form-group.has-error .form-input,
      .form-group.has-error .form-textarea {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
      }
      
      .form-group.focused .form-label {
        color: #fbbf24 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }

})();
