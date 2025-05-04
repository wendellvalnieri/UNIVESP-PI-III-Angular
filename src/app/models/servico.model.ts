export interface Servico {
    id: string;
    nome: string;
    preco: string;
    imagem: string | null;
    slug: string;
    descricao: string | null;
    criado: string;
    modificado: string;
    ativo: boolean;
  }