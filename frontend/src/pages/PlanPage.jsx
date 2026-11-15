import { useEffect, useState } from "react";

const FILTERS = [
    "Tümü",
    "Ekim",
    "Sulama",
    "Gübreleme",
    "İlaçlama",
];

const HISTORY_STORAGE_KEY = "geokernel_completed_plans_v1";

export default function PlanPage({
    user,
    field,
    crop,
    operations = [],
    onBack,
}) {
    const storageKey = `geokernel_plan_${field?.id}_${crop}`;

    const [statuses, setStatuses] = useState({});
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState("");
    const [yieldValue, setYieldValue] = useState("");
    const [yieldUnit, setYieldUnit] = useState("kg/da");
    const [activeFilter, setActiveFilter] = useState("Tümü");
    const [submitting, setSubmitting] = useState(false);

    // Kayıtlı taslak plan durumunu yükle
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);

        if (!saved) {
            setStatuses({});
            setFeedback("");
            setRating("");
            setYieldValue("");
            setYieldUnit("kg/da");
            return;
        }

        try {
            const parsed = JSON.parse(saved);
            setStatuses(parsed.statuses || {});
            setFeedback(parsed.feedback || "");
            setRating(parsed.rating || "");
            setYieldValue(parsed.yieldValue || "");
            setYieldUnit(parsed.yieldUnit || "kg/da");
        } catch (error) {
            console.error("Plan kaydı okunamadı:", error);
            setStatuses({});
            setFeedback("");
            setRating("");
        }
    }, [storageKey]);

    // İşlem durumunu taslak olarak kaydet
    const updateStatus = (index, status) => {
        const nextStatuses = {
            ...statuses,
            [index]: status,
        };

        setStatuses(nextStatuses);

        const current = JSON.parse(
            localStorage.getItem(storageKey) || "{}"
        );

        localStorage.setItem(
            storageKey,
            JSON.stringify({
                ...current,
                statuses: nextStatuses,
            })
        );
    };

    const completedCount = operations.filter(
        (_, index) => statuses[index] === "applied"
    ).length;

    const notAppliedCount = operations.filter(
        (_, index) => statuses[index] === "not_applied"
    ).length;

    const markedCount = completedCount + notAppliedCount;

    const allMarked =
        operations.length > 0 && markedCount === operations.length;

    const progress =
        operations.length > 0
            ? (markedCount / operations.length) * 100
            : 0;

    const filteredOperations =
        activeFilter === "Tümü"
            ? operations
            : operations.filter((op) => op.category === activeFilter);

    // Geri bildirimi kaydet ve sayfayı sıfırla
    const submitFeedback = () => {
        if (!rating || !feedback.trim()) {
            alert("Lütfen değerlendirme seçin ve gözlemlerinizi yazın.");
            return;
        }

        setSubmitting(true);

        const completedPlanRecord = {
            id: Date.now(),
            fieldId: field.id,
            fieldName: field.name,
            userId: user?.id || 1,
            crop,
            operations,
            statuses,
            rating,
            feedback: feedback.trim(),
            yieldValue: yieldValue || "-",
            yieldUnit,
            createdAt: new Date().toISOString(),
        };

        // Geçmiş planlar listesine (localStorage) ekle
        try {
            const existingHistory = JSON.parse(
                localStorage.getItem(HISTORY_STORAGE_KEY) || "[]"
            );
            localStorage.setItem(
                HISTORY_STORAGE_KEY,
                JSON.stringify([completedPlanRecord, ...existingHistory])
            );
        } catch (err) {
            console.error("Yerel geçmiş kaydı oluşturulamadı:", err);
        }

        // Aktif taslağı sil ve sayfadaki tüm alanları sıfırla
        localStorage.removeItem(storageKey);
        setStatuses({});
        setFeedback("");
        setRating("");
        setYieldValue("");
        setYieldUnit("kg/da");
        setActiveFilter("Tümü");
        setSubmitting(false);

        alert(
            "Plan ve sezon sonu değerlendirmeniz kaydedildi! Geçmiş Plan Kayıtları bölümünden detayları inceleyebilirsiniz."
        );
    };

    if (!field || !crop) {
        return (
            <div style={styles.page}>
                <p>Plan bilgisi bulunamadı.</p>
                <button onClick={onBack} style={styles.backButton}>
                    Geri Dön
                </button>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            {/* BAŞLIK */}
            <div style={styles.header}>
                <button onClick={onBack} style={styles.backButton}>
                    ← Ürün Karşılaştırmasına Dön
                </button>

                <h2 style={{ margin: "12px 0 5px" }}>
                    {crop} — Sezonluk Uygulama Planı
                </h2>

                <div style={styles.headerInfo}>
                    Tarla: {field.name}
                    {field.city && field.district
                        ? ` • ${field.city} / ${field.district}`
                        : ""}
                </div>
            </div>

            {/* İLERLEME DURUMU */}
            <div style={styles.progressCard}>
                <h3 style={{ marginTop: 0, color: "#064e3b" }}>
                    Plan İlerleme Durumu
                </h3>

                <div style={styles.progressNumbers}>
                    <span>
                        {markedCount} / {operations.length} işlem değerlendirildi
                    </span>

                    <strong>%{Math.round(progress)}</strong>
                </div>

                <div style={styles.progressBackground}>
                    <div
                        style={{
                            ...styles.progressFill,
                            width: `${progress}%`,
                        }}
                    />
                </div>

                <div style={styles.summary}>
                    <span>✓ Uygulanan: {completedCount}</span>
                    <span>✕ Uygulanmayan: {notAppliedCount}</span>
                </div>
            </div>

            {/* FİLTRELER */}
            <div style={styles.filters}>
                {FILTERS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        style={{
                            ...styles.filterButton,
                            background:
                                activeFilter === filter ? "#064e3b" : "#ffffff",
                            color:
                                activeFilter === filter ? "#ffffff" : "#374151",
                            borderColor:
                                activeFilter === filter ? "#064e3b" : "#d1d5db",
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* İŞLEM KARTLARI */}
            {operations.length === 0 ? (
                <div style={styles.empty}>
                    Bu ürün için henüz bir uygulama planı bulunmuyor.
                </div>
            ) : (
                <div style={styles.operationGrid}>
                    {filteredOperations.map((op) => {
                        const index = operations.indexOf(op);
                        const status = statuses[index];

                        return (
                            <div
                                key={`${op.title}-${index}`}
                                style={{
                                    ...styles.operationCard,
                                    borderColor:
                                        status === "applied"
                                            ? "#86efac"
                                            : status === "not_applied"
                                                ? "#fca5a5"
                                                : "#e5e7eb",
                                }}
                            >
                                <div style={styles.operationTop}>
                                    <span style={styles.category}>
                                        {op.category?.toUpperCase() || "İŞLEM"}
                                    </span>

                                    <span style={styles.date}>
                                        📅 {op.window || "Tarih belirtilmedi"}
                                    </span>
                                </div>

                                <h3 style={styles.operationTitle}>{op.title}</h3>

                                <p style={styles.operationDetail}>{op.detail}</p>

                                <div style={styles.statusButtons}>
                                    <button
                                        onClick={() => updateStatus(index, "applied")}
                                        style={{
                                            ...styles.appliedButton,
                                            background:
                                                status === "applied" ? "#bbf7d0" : "#ffffff",
                                            border:
                                                status === "applied"
                                                    ? "2px solid #047857"
                                                    : "1px solid #d1d5db",
                                        }}
                                    >
                                        ✓ Uyguladım
                                    </button>

                                    <button
                                        onClick={() => updateStatus(index, "not_applied")}
                                        style={{
                                            ...styles.notAppliedButton,
                                            background:
                                                status === "not_applied"
                                                    ? "#fee2e2"
                                                    : "#ffffff",
                                            border:
                                                status === "not_applied"
                                                    ? "2px solid #b91c1c"
                                                    : "1px solid #d1d5db",
                                        }}
                                    >
                                        ✕ Uygulamadım
                                    </button>
                                </div>

                                {status && (
                                    <div
                                        style={{
                                            marginTop: "10px",
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            color:
                                                status === "applied" ? "#047857" : "#b91c1c",
                                        }}
                                    >
                                        {status === "applied"
                                            ? "Bu işlem uygulandı olarak kaydedildi."
                                            : "Bu işlem uygulanmadı olarak kaydedildi."}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* SEZON SONU GERİ BİLDİRİM */}
            {allMarked && (
                <div style={styles.feedbackCard}>
                    <h3 style={{ color: "#064e3b", marginTop: 0 }}>
                        Sezonluk Plan Değerlendirmesi
                    </h3>

                    <p style={styles.feedbackDescription}>
                        Plandaki tüm işlemleri değerlendirdiniz. Şimdi uygulama
                        sürecinin sonuçlarını paylaşabilirsiniz.
                    </p>

                    <label style={styles.label}>
                        Planın genel başarısını nasıl değerlendirirsiniz?
                    </label>

                    <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">Değerlendirme seçin</option>
                        <option value="very_good">Çok başarılı</option>
                        <option value="good">Başarılı</option>
                        <option value="average">Orta</option>
                        <option value="poor">Beklediğim gibi olmadı</option>
                    </select>

                    <label style={styles.label}>
                        Gerçekleşen Verim (İsteğe Bağlı)
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="number"
                            value={yieldValue}
                            onChange={(e) => setYieldValue(e.target.value)}
                            placeholder="Örn: 320"
                            style={{ ...styles.select, flex: 2 }}
                        />
                        <select
                            value={yieldUnit}
                            onChange={(e) => setYieldUnit(e.target.value)}
                            style={{ ...styles.select, flex: 1 }}
                        >
                            <option value="kg/da">kg / da</option>
                            <option value="ton/da">ton / da</option>
                        </select>
                    </div>

                    <label style={styles.label}>Sezon sonu gözlemleriniz</label>

                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Ürünün gelişimi, verim, su tüketimi, hava koşulları veya yaşadığınız sorunları anlatabilirsiniz..."
                        rows={5}
                        style={styles.textarea}
                    />

                    <button
                        onClick={submitFeedback}
                        disabled={submitting}
                        style={{
                            ...styles.submitButton,
                            opacity: submitting ? 0.7 : 1,
                        }}
                    >
                        {submitting
                            ? "Kaydediliyor..."
                            : "Geri Bildirimi Gönder ve Planı Tamamla"}
                    </button>
                </div>
            )}
        </div>

    );
}

const styles = {
    page: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
    },
    header: {
        background: "#064e3b",
        color: "#ffffff",
        padding: "22px",
        borderRadius: "14px",
        marginBottom: "22px",
    },
    headerInfo: {
        fontSize: "13px",
        color: "#d1fae5",
    },
    backButton: {
        background: "#ffffff",
        color: "#064e3b",
        border: "none",
        borderRadius: "8px",
        padding: "9px 14px",
        fontWeight: 700,
        cursor: "pointer",
    },
    progressCard: {
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        padding: "18px",
        borderRadius: "12px",
        marginBottom: "20px",
    },
    progressNumbers: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        marginBottom: "8px",
    },
    progressBackground: {
        height: "12px",
        background: "#d1d5db",
        borderRadius: "10px",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        background: "#059669",
        transition: "width 0.2s",
    },
    summary: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        marginTop: "12px",
        fontSize: "13px",
        fontWeight: 700,
        color: "#374151",
    },
    filters: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginBottom: "18px",
    },
    filterButton: {
        padding: "9px 15px",
        borderRadius: "8px",
        border: "1px solid",
        fontWeight: 700,
        cursor: "pointer",
    },
    operationGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "14px",
    },
    operationCard: {
        background: "#ffffff",
        border: "1px solid",
        borderRadius: "12px",
        padding: "18px",
    },
    operationTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "10px",
    },
    category: {
        background: "#d1fae5",
        color: "#065f46",
        padding: "4px 9px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: 800,
    },
    date: {
        color: "#0369a1",
        fontSize: "12px",
        fontWeight: 700,
    },
    operationTitle: {
        fontSize: "16px",
        margin: "0 0 8px",
        color: "#111827",
    },
    operationDetail: {
        fontSize: "13px",
        color: "#4b5563",
        lineHeight: 1.5,
        minHeight: "55px",
    },
    statusButtons: {
        display: "flex",
        gap: "8px",
        marginTop: "12px",
    },
    appliedButton: {
        flex: 1,
        padding: "10px 5px",
        borderRadius: "8px",
        color: "#065f46",
        fontWeight: 700,
        cursor: "pointer",
    },
    notAppliedButton: {
        flex: 1,
        padding: "10px 5px",
        borderRadius: "8px",
        color: "#991b1b",
        fontWeight: 700,
        cursor: "pointer",
    },
    empty: {
        background: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #d1d5db",
    },
    feedbackCard: {
        background: "#ffffff",
        border: "1px solid #bbf7d0",
        borderRadius: "12px",
        padding: "22px",
        marginTop: "24px",
    },
    feedbackDescription: {
        color: "#4b5563",
        fontSize: "14px",
        lineHeight: 1.5,
    },
    label: {
        display: "block",
        fontWeight: 700,
        fontSize: "14px",
        marginTop: "16px",
        marginBottom: "7px",
    },
    select: {
        display: "block",
        width: "100%",
        boxSizing: "border-box",
        padding: "11px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
    },
    textarea: {
        display: "block",
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        resize: "vertical",
        fontFamily: "inherit",
    },
    submitButton: {
        marginTop: "14px",
        padding: "12px 20px",
        background: "#064e3b",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontWeight: 800,
        cursor: "pointer",
    },
};