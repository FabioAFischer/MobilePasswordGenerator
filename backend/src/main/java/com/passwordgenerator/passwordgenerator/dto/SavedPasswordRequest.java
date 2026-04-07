package com.passwordgenerator.passwordgenerator.dto;

public class SavedPasswordRequest {
    private String nomeAplicativo;
    private String senha;

    public String getNomeAplicativo() {
        return nomeAplicativo;
    }

    public void setNomeAplicativo(String nomeAplicativo) {
        this.nomeAplicativo = nomeAplicativo;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
