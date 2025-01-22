document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quoteForm');
    const notification = document.getElementById('notification');
  
    // Função para formatar o número de telefone
    function formatPhoneNumber(input) {
      let value = input.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      
      if (value.length > 7) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      }
      
      input.value = value;
    }
  
    // Adiciona máscara ao campo de telefone
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', () => formatPhoneNumber(phoneInput));
  
    // Função para mostrar notificação
    function showNotification(message, type) {
      notification.textContent = message;
      notification.className = `notification ${type}`;
      notification.style.display = 'block';
      
      setTimeout(() => {
        notification.style.display = 'none';
      }, 3000);
    }
  
    // Função para preparar mensagem do WhatsApp
    function prepareWhatsAppMessage(formData) {
      const serviceTypes = {
        montagem: 'Montagem de Móveis',
        frete: 'Pequenos Fretes',
        combinado: 'Montagem de Móveis + Pequenos Fretes'
      };
  
      return encodeURIComponent(`
  *Novo Pedido de Orçamento*
  Nome: ${formData.get('name')}
  Telefone: ${formData.get('phone')}
  Serviço: ${serviceTypes[formData.get('service')]}
  Descrição: ${formData.get('description')}
  Detalhes Adicionais: ${formData.get('details') || 'Não informado'}
      `);
    }
  
    // Manipula o envio do formulário
    quoteForm.addEventListener('submit', async function(e) {
      e.preventDefault();
  
      const formData = new FormData(quoteForm);
      const whatsappMessage = prepareWhatsAppMessage(formData);
      
      try {
        const whatsappNumber = '5582998092831'; // Substitua pelo número correto
        window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
        
        showNotification('Orçamento enviado com sucesso!', 'success');
        quoteForm.reset();
      } catch (error) {
        showNotification('Erro ao enviar orçamento. Tente novamente.', 'error');
      }
    });
  
    // Adiciona visualização prévia das imagens
    const photosInput = document.getElementById('photos');
    photosInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      
      if (files.length > 5) {
        showNotification('Máximo de 5 fotos permitidas', 'error');
        photosInput.value = '';
        return;
      }
  
      files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) { // 5MB
          showNotification('Arquivo muito grande. Máximo 5MB por foto.', 'error');
          photosInput.value = '';
          return;
        }
      });
    });
  });