package si.um.tids.languageassistant.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.time.LocalDate;

public class RezultatKviza {
    @JacksonXmlProperty(isAttribute = true)
    private String id;
    private String besedaId;
    private String tipVprasanja;
    private boolean pravilen;
    private double casOdgovora;
    private LocalDate datum;

    public RezultatKviza() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBesedaId() { return besedaId; }
    public void setBesedaId(String besedaId) { this.besedaId = besedaId; }
    public String getTipVprasanja() { return tipVprasanja; }
    public void setTipVprasanja(String tipVprasanja) { this.tipVprasanja = tipVprasanja; }
    public boolean isPravilen() { return pravilen; }
    public void setPravilen(boolean pravilen) { this.pravilen = pravilen; }
    public double getCasOdgovora() { return casOdgovora; }
    public void setCasOdgovora(double casOdgovora) { this.casOdgovora = casOdgovora; }
    public LocalDate getDatum() { return datum; }
    public void setDatum(LocalDate datum) { this.datum = datum; }
}
