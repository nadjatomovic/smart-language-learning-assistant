package si.um.tids.languageassistant.model;

public class FiltriranZapis {
    private String id;
    private String beseda;
    private String jezik;
    private String prevod;
    private double uspesnost;
    private int steviloPoskusov;

    public FiltriranZapis() {}

    public FiltriranZapis(String id, String beseda, String jezik, String prevod, double uspesnost, int steviloPoskusov) {
        this.id = id;
        this.beseda = beseda;
        this.jezik = jezik;
        this.prevod = prevod;
        this.uspesnost = uspesnost;
        this.steviloPoskusov = steviloPoskusov;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBeseda() { return beseda; }
    public void setBeseda(String beseda) { this.beseda = beseda; }
    public String getJezik() { return jezik; }
    public void setJezik(String jezik) { this.jezik = jezik; }
    public String getPrevod() { return prevod; }
    public void setPrevod(String prevod) { this.prevod = prevod; }
    public double getUspesnost() { return uspesnost; }
    public void setUspesnost(double uspesnost) { this.uspesnost = uspesnost; }
    public int getSteviloPoskusov() { return steviloPoskusov; }
    public void setSteviloPoskusov(int steviloPoskusov) { this.steviloPoskusov = steviloPoskusov; }
}
