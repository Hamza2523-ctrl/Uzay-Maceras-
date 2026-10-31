enemy.shootTimer++;
            if (enemy.shootTimer >= enemy.shootInterval) { 
                const startX = enemy.x + enemy.width / 2;
                const startY = enemy.y + enemy.height;

                if (enemy.isBoss) {
                    const angles = [-0.4, -0.2, 0, 0.2, 0.4];
                    angles.forEach(ang => {
                        enemyBullets.push({
                            x: startX,
                            y: startY,
                            vx: Math.sin(ang) * 1.5,
                            vy: Math.cos(ang) * 1.5,
                            size: 12,
                            color: "#00ff66"
                        });
                    });
                } else {
                    const targetX = player.x + player.width / 2;
                    const targetY = player.y + player.height / 2;
                    const angle = Math.atan2(targetY - startY, targetX - startX);

                    enemyBullets.push({
                        x: startX,
                        y: startY,
                        vx: Math.cos(angle) * enemy.bulletSpeed,
                        vy: Math.sin(angle) * enemy.bulletSpeed,
                        size: (enemy.isSinsiBoss || currentLevel >= 6) ? 12 : 8,
                        color: enemy.bulletColor
                    });
                }

                enemy.shootTimer = 0;
            }
        }
    });

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        let eb = enemyBullets[i];
        eb.x += eb.vx;
        eb.y += eb.vy;

        if (
            eb.x > player.x &&
            eb.x < player.x + player.width &&
            eb.y > player.y &&
            eb.y < player.y + player.height
        ) {
            player.hp -= 5;
            enemyBullets.splice(i, 1);

            if (player.hp <= 0) {
                player.hp = 0;
                playGameOverSound();
                gameState = 'gameover';
            }
            continue;
        }

        if (eb.y > canvas.height + 20 || eb.x < -20 || eb.x > canvas.width + 20) {
            enemyBullets.splice(i, 1);
        }
    }

    if (!isBotVsMode) {
        for (let i = apples.length - 1; i >= 0; i--) {
            let apple = apples[i];
            apple.y += apple.speed;

            if (
                player.x < apple.x + apple.size &&
                player.x + player.width > apple.x &&
                player.y < apple.y + apple.size &&
                player.y + player.height > apple.y
            ) {
                player.hp = Math.min(player.maxHp, player.hp + 5);
                appleNotificationTimer = 120;
                apples.splice(i, 1);
                continue;
            }

            if (apple.y > canvas.height + 40) {
                apples.splice(i, 1);
            }
        }
    }

    if (appleNotificationTimer > 0) appleNotificationTimer--;
}

function drawButton(btn, bgColor, hoverColor, textColor, text, fontSize = "18px", isLocked = false) {
    const hovered = isHovered(btn) && !isLocked;
    ctx.fillStyle = isLocked ? "#334155" : (hovered ? hoverColor : bgColor);
    
    const scaleOffset = hovered ? 4 : 0;
    ctx.fillRect(btn.x - scaleOffset / 2, btn.y - scaleOffset / 2, btn.width + scaleOffset, btn.height + scaleOffset);

    ctx.strokeStyle = isLocked ? "#64748b" : "#ffffff";
    ctx.lineWidth = hovered ? 3 : 2;
    ctx.strokeRect(btn.x - scaleOffset / 2, btn.y - scaleOffset / 2, btn.width + scaleOffset, btn.height + scaleOffset);

    ctx.fillStyle = isLocked ? "#94a3b8" : textColor;
    ctx.font = `bold ${fontSize} Arial`;
    ctx.fillText(text, btn.x + 8, btn.y + (btn.height / 2) + 6);
}

function draw() {
    let isAyUnlocked = completedUniqueLevels.includes(10);

    if (isAyUnlocked && gameState === 'start') {
        ctx.fillStyle = "#111827"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2 + 50, 280, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.arc(canvas.width / 2 - 80, canvas.height / 2 - 20, 55, 0, Math.PI * 2);
        ctx.arc(canvas.width / 2 + 100, canvas.height / 2 + 80, 40, 0, Math.PI * 2);
        ctx.arc(canvas.width / 2 + 40, canvas.height / 2 - 90, 35, 0, Math.PI * 2);
        ctx.arc(canvas.width / 2 - 70, canvas.height / 2 + 120, 45, 0, Math.PI * 2);
        ctx.fill();
    } else if (currentLevel === 10 && gameState === 'playing') {
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.arc(canvas.width - 200, 180, 100, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#d1d5db";
        ctx.beginPath();
        ctx.arc(canvas.width - 230, 150, 20, 0, Math.PI * 2);
        ctx.arc(canvas.width - 170, 210, 15, 0, Math.PI * 2);
        ctx.arc(canvas.width - 200, 220, 25, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.fillStyle = "#07071a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(250, 150, 3, 3);
        ctx.fillRect(750, 350, 3, 3);
        ctx.fillRect(1300, 220, 2, 2);
        ctx.fillRect(1600, 650, 3, 3);
        ctx.fillRect(500, 800, 3, 3);
        ctx.fillRect(1100, 850, 2, 2);
    }

    if (gameState === 'start') {
        drawButton(profileBtn, "#10b981", "#34d399", "#ffffff", "👤 PROFİL", "19px");
        drawButton(shopBtn, "#00d2ff", "#38bdf8", "#000000", "🛒 DÜKKAN", "19px");

        const coinBox = { x: shopBtn.x + shopBtn.width + 15, y: shopBtn.y, width: 200, height: 50 };
        drawButton(coinBox, "#ffd700", "#fde047", "#000000", "🪙 AKÇE: " + totalCoins, "18px");

        drawButton(helpBtn, "#a855f7", "#c084fc", "#ffffff", "❓ YARDIM", "19px");

        drawButton(spaceStationBtn, "#00ff66", "#34d399", "#000000", "🚀 UZAY İSTASYONU", "15px");
        drawButton(otherModesBtn, "#7209b7", "#9d4edd", "#ffffff", "🌀 DİĞER MODLAR", "17px");
        drawButton(universeMapBtn, "#3a86ff", "#4ea8de", "#ffffff", "🌌 GİDİLEN YERLER", "16px");
        drawButton(titlesBtn, "#f72585", "#ff4d6d", "#ffffff", "🎖️ ÜNVANLAR", "18px");

        const newsHover = isHovered(newsBox);
        ctx.fillStyle = newsHover ? "rgba(15, 25, 55, 0.95)" : "rgba(10, 15, 35, 0.85)";
        ctx.fillRect(newsBox.x, newsBox.y, newsBox.width, newsBox.height);
        ctx.strokeStyle = newsHover ? "#38bdf8" : "#00d2ff";
        ctx.lineWidth = newsHover ? 3 : 2;
        ctx.strokeRect(newsBox.x, newsBox.y, newsBox.width, newsBox.height);

        ctx.fillStyle = "#00d2ff";
        ctx.font = "bold 18px Arial";
        ctx.fillText("📰 HABERLER (Tıkla)", newsBox.x + 22, newsBox.y + 30);

        if (playerImg.complete && playerImg.naturalWidth !== 0) {
            ctx.drawImage(playerImg, newsBox.x + (newsBox.width / 2) - 30, newsBox.y + 42, 60, 65);
        }

        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 15px Arial";
        ctx.fillText("🚀 UZAY İSTASYONU EKLENDİ!", newsBox.x + 10, newsBox.y + 135);
        ctx.fillStyle = "#cccccc";
        ctx.font = "14px Arial";
        ctx.fillText("Güneş, Gezegenler & Telsiz Haberlerini", newsBox.x + 10, newsBox.y + 162);
        ctx.fillText("Keşfetmek İçin Hemen Tıkla!", newsBox.x + 20, newsBox.y + 185);

        drawButton(questsBtn, "#e056fd", "#f368e0", "#ffffff", "🎯 GÜNLÜK GÖREVLER", "18px");
        drawButton(lootBoxBtn, "#9b59b6", "#be2edd", "#ffffff", `🎁 UZAY KUTUSU (${lootBoxKeys})`, "18px");

        ctx.fillStyle = "#00d2ff";
        ctx.shadowColor = "#00d2ff";
        ctx.shadowBlur = 30;
        ctx.font = "bold 80px Arial";
        ctx.fillText("KAPTAN HAMZA", canvas.width / 2 - 315, 230);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 44px Arial";
        ctx.fillText("UZAY SAVAŞÇISI", canvas.width / 2 - 180, 300);
        ctx.shadowBlur = 0;

        drawButton(warriorsBtn, "#ffaa00", "#fbbf24", "#000000", "🛡️ SAVAŞÇILAR", "22px");
        drawButton(startBtn, "#ff3366", "#fb7185", "#ffffff", "OYUNA BAŞLA", "24px");

        if (isSpaceStationOpen) {
            ctx.fillStyle = "rgba(5, 10, 25, 0.98)";
            ctx.fillRect(150, 80, canvas.width - 300, canvas.height - 160);
            ctx.strokeStyle = "#00ff66";
            ctx.lineWidth = 4;
            ctx.strokeRect(150, 80, canvas.width - 300, canvas.height - 160);

            ctx.fillStyle = "#00ff66";
            ctx.font = "bold 38px Arial";
            ctx.fillText("🚀 UZAY İSTASYONU & BİLGİ BANKASI", canvas.width / 2 - 335, 140);

            ctx.fillStyle = "#ffffff";
            ctx.font = "18px Arial";
            ctx.fillText("İncelemek istediğin gök cismine veya canlı Telsize tıkla:", canvas.width / 2 - 240, 180);

            celestialButtons.forEach(btn => {
                drawButton(btn, "#1e293b", "#334155", "#ffffff", btn.name, "18px");
            });

            drawButton(radioBtn, "#eab308", "#fde047", "#000000", "📻 TELSİZİ AÇ", "18px");

            if (radioTextTimer > 0) {
                radioTextTimer--;
                ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
                ctx.fillRect(canvas.width / 2 - 420, canvas.height / 2 + 130, 840, 50);
                ctx.strokeStyle = "#eab308";
                ctx.lineWidth = 2;
                ctx.strokeRect(canvas.width / 2 - 420, canvas.height / 2 + 130, 840, 50);

                ctx.fillStyle = "#fef08a";
                ctx.font = "bold 16px Arial";
                ctx.fillText(currentRadioText, canvas.width / 2 - 400, canvas.height / 2 + 162);
            }

            drawButton(closeSpaceStationBtn, "#ff3366", "#fb7185", "#ffffff", "KAPAT", "20px");
        }

        if (selectedCelestialBody) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.92)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#fef08a"; 
            ctx.fillRect(canvas.width / 2 - 420, 120, 840, 600);
            ctx.strokeStyle = "#854d0e";
            ctx.lineWidth = 5;
            ctx.strokeRect(canvas.width / 2 - 420, 120, 840, 600);

            ctx.fillStyle = "#78350f";
            ctx.font = "bold 32px Arial";
            ctx.fillText(selectedCelestialBody.name, canvas.width / 2 - 380, 180);

            drawWrappedText(
                selectedCelestialBody.info,
                canvas.width / 2 - 380,
                225,
                760, 
                28,  
                "#1c1917", 
                "#b45309"
            );

            drawButton(closeInfoCardBtn, "#b45309", "#d97706", "#ffffff", "KAYDET & KAPAT", "16px");
        }

        if (isTitlesOpen) {
            ctx.fillStyle = "rgba(5, 5, 25, 0.98)";
            ctx.fillRect(200, 100, canvas.width - 400, canvas.height - 200);
            ctx.strokeStyle = "#f72585";
            ctx.lineWidth = 4;
            ctx.strokeRect(200, 100, canvas.width - 400, canvas.height - 200);

            ctx.fillStyle = "#f72585";
            ctx.font = "bold 38px Arial";
            ctx.fillText("🎖️ OYUNCU ÜNVANLARI", canvas.width / 2 - 190, 165);

            let titleY = 220;
            titles.forEach(t => {
                ctx.fillStyle = t.unlocked ? "rgba(0, 255, 102, 0.08)" : "rgba(255, 51, 51, 0.08)";
                ctx.fillRect(250, titleY, canvas.width - 500, 80);
                ctx.strokeStyle = t.unlocked ? "#00ff66" : "#ff3333";
                ctx.lineWidth = 2;
                ctx.strokeRect(250, titleY, canvas.width - 500, 80);

                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 20px Arial";
                ctx.fillText(t.name, 280, titleY + 32);

                ctx.fillStyle = "#cccccc";
                ctx.font = "15px Arial";
                ctx.fillText(t.desc, 280, titleY + 58);

                ctx.fillStyle = t.unlocked ? "#00ff66" : "#ff3333";
                ctx.font = "bold 18px Arial";
                ctx.fillText(t.unlocked ? "ALINDI ✓" : "ALINMADI 🔒", canvas.width - 410, titleY + 45);

                titleY += 95;
            });

            drawButton(closeTitlesBtn, "#ff3366", "#fb7185", "#ffffff", "KAPAT", "20px");
        }

        if (isUniverseMapOpen) {
            ctx.fillStyle = "rgba(5, 5, 25, 0.98)";
            ctx.fillRect(150, 80, canvas.width - 300, canvas.height - 160);
            ctx.strokeStyle = "#3a86ff";
            ctx.lineWidth = 4;
            ctx.strokeRect(150, 80, canvas.width - 300, canvas.height - 160);

            ctx.fillStyle = "#3a86ff";
            ctx.font = "bold 38px Arial";
            ctx.fillText("🌌 EVRENDE GİDİLEN YERLER & İLERLEME ÇUBUĞU", canvas.width / 2 - 380, 145);

            ctx.fillStyle = "#ffffff";
            ctx.font = "18px Arial";
            ctx.fillText(`Benzersiz Bitirilen Bölüm Sayısı: ${completedUniqueLevels.length} / 60`, canvas.width / 2 - 190, 185);

            const lineY = 310;
            const startX = 250;
            const totalBarWidth = canvas.width - 500;

            ctx.fillStyle = "#1e293b";
            ctx.fillRect(startX, lineY - 6, totalBarWidth, 12);

            let uniqueCount = completedUniqueLevels.length;

            const stations = [
                { name: "1. Uzay", req: 0, targetRatio: 0, unlocked: true },
                { name: "10. Bölüm (Ay)", req: 10, targetRatio: 10 / 60, unlocked: uniqueCount >= 10 },
                { name: "30. Bölüm (Mars)", req: 30, targetRatio: 30 / 60, unlocked: uniqueCount >= 30 },
                { name: "60. Bölüm (Venüs)", req: 60, targetRatio: 60 / 60, unlocked: uniqueCount >= 60 }
            ];

            let currentFillWidth = 0;
            if (uniqueCount <= 10) {
                currentFillWidth = totalBarWidth * (stations[1].targetRatio * (uniqueCount / 10));
            } else if (uniqueCount <= 30) {
                let rangeSpan = stations[2].targetRatio - stations[1].targetRatio;
                currentFillWidth = totalBarWidth * (stations[1].targetRatio + rangeSpan * ((uniqueCount - 10) / 20));
            } else {
                let rangeSpan = stations[3].targetRatio - stations[2].targetRatio;
                currentFillWidth = totalBarWidth * (stations[2].targetRatio + rangeSpan * ((uniqueCount - 30) / 30));
            }

            ctx.fillStyle = "#00ff66";
            ctx.fillRect(startX, lineY - 6, Math.min(totalBarWidth, currentFillWidth), 12);

            const spacing = totalBarWidth / (stations.length - 1);

            stations.forEach((st, idx) => {
                const nodeX = startX + (idx * spacing);

                ctx.fillStyle = st.unlocked ? "#00ff66" : "#64748b";
                ctx.beginPath();
                ctx.arc(nodeX, lineY, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 18px Arial";
                ctx.fillText(st.name, nodeX - 55, lineY - 45);

                ctx.fillStyle = st.unlocked ? "#00ff66" : "#ffaa00";
                ctx.font = "15px Arial";
                if (st.req === 0) {
                    ctx.fillText("AÇIK ✓", nodeX - 25, lineY + 45);
                } else if (st.unlocked) {
                    ctx.fillText("AÇILDI ✓", nodeX - 30, lineY + 45);
                } else {
                    ctx.fillText(`🔒 ${st.req} Farklı Bölüm Şart`, nodeX - 65, lineY + 45);
                }
            });

            drawButton(closeUniverseMapBtn, "#ff3366", "#fb7185", "#ffffff", "KAPAT", "20px");
        }

        if (isLootBoxOpen) {
            ctx.fillStyle = "rgba(10, 5, 25, 0.97)";
            ctx.fillRect(250, 120, canvas.width - 500, canvas.height - 240);
            ctx.strokeStyle = "#be2edd";
            ctx.lineWidth = 4;
            ctx.strokeRect(250, 120, canvas.width - 500, canvas.height - 240);

            ctx.fillStyle = "#be2edd";
            ctx.font = "bold 40px Arial";
            ctx.fillText("🎁 UZAY KUTUSU", canvas.width / 2 - 160, 190);

            ctx.fillStyle = "#ffffff";
            ctx.font = "20px Arial";
            ctx.fillText(`Kazanılan Maç: ${totalWins} | Kutu Hakkı: ${lootBoxKeys} | Açılan Kutu: ${totalBoxesOpened}/4`, canvas.width / 2 - 270, 235);

            ctx.fillStyle = "rgba(190, 46, 221, 0.15)";
            ctx.fillRect(canvas.width / 2 - 100, 270, 200, 160);
            ctx.strokeStyle = "#ffd700";
            ctx.lineWidth = 3;
            ctx.strokeRect(canvas.width / 2 - 100, 270, 200, 160);

            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 70px Arial";
            ctx.fillText("🎁", canvas.width / 2 - 35, 375);

            if (isBoxOpenedAnimation) {
                ctx.fillStyle = "#00ff66";
                ctx.font = "bold 28px Arial";
                ctx.fillText(`🪙 TEBRİKLER! +${lastWonCoinsFromBox} AKÇE KAZANDIN!`, canvas.width / 2 - 270, 475);
            } else if (totalBoxesOpened >= 4) {
                ctx.fillStyle = "#ff3333";
                ctx.font = "bold 22px Arial";
                ctx.fillText("🔒 MAKSİMUM KUTU AÇMA SINIRINA ULAŞTIN! (4/4)", canvas.width / 2 - 260, 475);
            } else if (lootBoxKeys <= 0) {
                ctx.fillStyle = "#ffaa00";
                ctx.font = "bold 22px Arial";
                ctx.fillText("⚠️ Kutu açmak için 2 maç daha kazanmalısın!", canvas.width / 2 - 240, 475);
            } else {
                ctx.fillStyle = "#00d2ff";
                ctx.font = "bold 22px Arial";
                ctx.fillText("Kutuyu açmak için aşağıdaki butona tıkla!", canvas.width / 2 - 200, 475);
            }

            if (lootBoxKeys > 0 && totalBoxesOpened < 4) {
                drawButton(openBoxActionBtn, "#00ff66", "#34d399", "#000000", "KUTUYU AÇ 🎁", "20px");
            }

            drawButton(closeLootBoxBtn, "#ff3366", "#fb7185", "#ffffff", "KAPAT", "20px");
        }

        if (isQuestsOpen) {
            ctx.fillStyle = "rgba(5, 10, 25, 0.96)";
            ctx.fillRect(200, 100, canvas.width - 400, canvas.height - 200);
            ctx.strokeStyle = "#e056fd";
            ctx.lineWidth = 4;
            ctx.strokeRect(200, 100, canvas.width - 400, canvas.height - 200);

            ctx.fillStyle = "#e056fd";
            ctx.font = "bold 38px Arial";
            ctx.fillText("🎯 GÜNLÜK GÖREVLER", canvas.width / 2 - 180, 165);

            ctx.fillStyle = "rgba(224, 86, 253, 0.1)";
            ctx.fillRect(250, 220, canvas.width - 500, 100);
            ctx.strokeStyle = "#e056fd";
            ctx.lineWidth = 2;
            ctx.strokeRect(250, 220, canvas.width - 500, 100);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 22px Arial";
            ctx.fillText("1. Görev: Seviye 1'i 2 Kez Bitir", 280, 260);
            ctx.fillStyle = "#ffd700";
            ctx.font = "18px Arial";
            ctx.fillText("İlerleme: " + quest1Progress + " / 2 | Ödül: 50 Akçe", 280, 292);

            if (quest1Claimed) {
                ctx.fillStyle = "#00ff66";
                ctx.font = "bold 18px Arial";
                ctx.fillText("ALINDI ✓", canvas.width - 320, 278);
            } else if (quest1Completed) {
                drawButton(claimQuest1Btn, "#00ff66", "#34d399", "#000000", "ÖDÜLÜ AL", "16px");
            } else {
                ctx.fillStyle = "#ff3333";
                ctx.font = "bold 18px Arial";
                ctx.fillText("DEVAM EDİYOR", canvas.width - 350, 278);
            }

            ctx.fillStyle = "rgba(224, 86, 253, 0.1)";
            ctx.fillRect(250, 345, canvas.width - 500, 100);
            ctx.strokeStyle = "#e056fd";
            ctx.lineWidth = 2;
            ctx.strokeRect(250, 345, canvas.width - 500, 100);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 22px Arial";
            ctx.fillText("2. Görev: Seviye 2'yi 1 Kez Tamamla", 280, 385);
            ctx.fillStyle = "#ffd700";
            ctx.font = "18px Arial";
            ctx.fillText("İlerleme: " + quest2Progress + " / 1 | Ödül: 100 Akçe", 280, 417);

            if (quest2Claimed) {
                ctx.fillStyle = "#00ff66";
                ctx.font = "bold 18px Arial";
                ctx.fillText("ALINDI ✓", canvas.width - 320, 403);
            } else if (quest2Completed) {
                drawButton(claimQuest2Btn, "#00ff66", "#34d399", "#000000", "ÖDÜLÜ AL", "16px");
            } else {
                ctx.fillStyle = "#ff3333";
                ctx.font = "bold 18px Arial";
                ctx.fillText("DEVAM EDİYOR", canvas.width - 350, 403);
            }

            drawButton(closeQuestsBtn, "#ff3366", "#fb7185", "#ffffff", "KAPAT", "20px");
        }

        if (isNewsOpen) {
            ctx.fillStyle = "rgba(5, 10, 25, 0.96)";
            ctx.fillRect(200, 80, canvas.width - 400, canvas.height - 160);
            ctx.strokeStyle = "#00d2ff";
            ctx.lineWidth = 4;
            ctx.strokeRect(200, 80, canvas.width - 400, canvas.height - 160);

            ctx.fillStyle = "#00d2ff";
            ctx.font = "bold 38px Arial";
            ctx.fillText("📰 OYUN HABERLERİ & GÜNCELLEMELER", canvas.width / 2 - 350, 150);

            let newsY = 220;
            const newsItems = [
                { title: "🧠 Yeni Yapay Zeka (AI) Rakip Eklendi!", desc: "Botlar artık akıllı yapay zeka ile hareket edip mermilerden kaçabiliyor!" },
                { title: "🤖 Bot VS Modu Aktif!", desc: "Diğer Modlar menüsünden rakibini ve zorluğu seç, hemen kapış!" },
                { title: "🚀 Uzay İstasyonuna Telsiz Eklendi!", desc: "Uzay İstasyonuna girip Telsiz haberlerini canlı dinleyin." }
            ];

            newsItems.forEach(item => {
                ctx.fillStyle = "#ffd700";
                ctx.font = "bold 21px Arial";
                ctx.fillText(item.title, 260, newsY);

                ctx.fillStyle = "#ffffff";
                ctx.font = "17px Arial";
                ctx.fillText(item.desc, 260, newsY + 30);

                newsY += 85;
            });

            drawButton(closeNewsBtn, "#ff3366", "#fb7185", "#ffffff", "KAPAT", "20px");
        }

        if (isShopOpen) {
            ctx.fillStyle = "rgba(5, 10, 25, 0.96)";
            ctx.fillRect(200, 100, canvas.width - 400, canvas.height - 200);
            ctx.strokeStyle = "#00d2ff";
            ctx.lineWidth = 4;
            ctx.strokeRect(200, 100, canvas.width - 400, canvas.height - 200);

            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 40px Arial";
            ctx.fillText("🛒 UZAY DÜKKANI", canvas.width / 2 - 170, 160);

            ctx.fillStyle = "#00ff66";
            ctx.font = "bold 21px Arial";
            ctx.fillText("🪙 Akçe: " + totalCoins, canvas.width - 410, 160);

            drawButton(catEfektBtn, shopCategory === 'efekt' ? "#00d2ff" : "#1a233a", "#38bdf8", shopCategory === 'efekt' ? "#000000" : "#ffffff", "✨ EFEKT", "19px");
            drawButton(catOzelGucBtn, shopCategory === 'ozel_guc' ? "#ffaa00" : "#1a233a", "#fbbf24", shopCategory === 'ozel_guc' ? "#000000" : "#ffffff", "⚡ ÖZEL GÜÇ", "19px");
            drawButton(catSavasciBtn, shopCategory === 'savasci' ? "#a855f7" : "#1a233a", "#c084fc", shopCategory === 'savasci' ? "#000000" : "#ffffff", "🛡️ SAVAŞÇI", "19px");

            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(250, 260, canvas.width - 500, 380);
            ctx.strokeStyle = "#334155";
            ctx.strokeRect(250, 260, canvas.width - 500, 380);

            if (shopCategory === 'savasci') {
                const card1X = 290;
                const card1Y = 280;
                ctx.fillStyle = "rgba(157, 78, 221, 0.15)";
                ctx.fillRect(card1X, card1Y, canvas.width - 580, 115);
                ctx.strokeStyle = "#9d4edd";
                ctx.lineWidth = 2;
                ctx.strokeRect(card1X, card1Y, canvas.width - 580, 115);

                if (alienImg.complete && alienImg.naturalWidth !== 0) {
                    ctx.drawImage(alienImg, card1X + 15, card1Y + 15, 85, 85);
                }

                ctx.fillStyle = "#c77dff";
                ctx.font = "bold 22px Arial";
                ctx.fillText("👽 Uzaylı Savaşçı", card1X + 120, card1Y + 42);
                ctx.fillStyle = "#cccccc";
                ctx.font = "15px Arial";
                ctx.fillText("105 Can ve Dengeli Hız (9) ile uzay liginin güçlü savaşçısı.", card1X + 120, card1Y + 75);

                if (!hasAlienWarrior) {
                    drawButton(buyAlienBtn, (totalCoins >= 15000) ? "#00ff66" : "#ff3333", "#34d399", "#000000", "SATIN AL (15.000)", "14px");
                } else {
                    drawButton(buyAlienBtn, "#00ff66", "#34d399", "#000000", "SAHİPSİN ✓", "14px");
                }

                const card2Y = 420;
                ctx.fillStyle = "rgba(255, 170, 0, 0.15)";
                ctx.fillRect(card1X, card2Y, canvas.width - 580, 115);
                ctx.strokeStyle = "#ffaa00";
                ctx.lineWidth = 2;
                ctx.strokeRect(card1X, card2Y, canvas.width - 580, 115);

                if (dogImg.complete && dogImg.naturalWidth !== 0) {
                    ctx.drawImage(dogImg, card1X + 15, card2Y + 15, 85, 85);
                }

                ctx.fillStyle = "#ffd700";
                ctx.font = "bold 22px Arial";
                ctx.fillText("🐶 Uzay Köpeği Savaşçısı", card1X + 120, card2Y + 42);
                ctx.fillStyle = "#cccccc";
                ctx.font = "15px Arial";
                ctx.fillText("85 Can ve Çok Yüksek Hız (12) ile aşırı çevik savaşçı dostumuz.", card1X + 120, card2Y + 75);

                if (!hasDogWarrior) {
                    drawButton(buyDogBtn, (totalCoins >= 14000) ? "#00ff66" : "#ff3333", "#34d399", "#000000", "SATIN AL (14.000)", "14px");
                } else {
                    drawButton(buyDogBtn, "#00ff66", "#34d399", "#000000", "SAHİPSİN ✓", "14px");
                }

            } else if (shopCategory === 'efekt') {
                const card1X = 290;
                const card1Y = 280;
                ctx.fillStyle = "rgba(128, 0, 32, 0.15)";
                ctx.fillRect(card1X, card1Y, canvas.width - 580, 105);
                ctx.strokeStyle = "#800020";
                ctx.lineWidth = 2;
                ctx.strokeRect(card1X, card1Y, canvas.width - 580, 105);

                ctx.fillStyle = "#800020";
                ctx.font = "bold 20px Arial";
                ctx.fillText("🔴 Bordo Mermi Efekti", card1X + 20, card1Y + 35);

                ctx.fillStyle = "#cccccc";
                ctx.font = "14px Arial";
                ctx.fillText("Mermileri koyu kırmızı renge çevirir.", card1X + 20, card1Y + 65);

                if (!hasBordoEffect) {
                    drawButton(buyBordoEffectBtn, (totalCoins >= 550) ? "#00ff66" : "#ff3333", "#34d399", "#000000", "SATIN AL (550)", "13px");
                } else if (isBordoEffectEquipped) {
                    drawButton(buyBordoEffectBtn, "#00ff66", "#34d399", "#000000", "SEÇİLİ ✓", "13px");
                } else {
                    drawButton(buyBordoEffectBtn, "#ffaa00", "#fbbf24", "#000000", "KUŞAN", "13px");
                }

                const card2Y = 395;
                ctx.fillStyle = "rgba(255, 123, 0, 0.15)";
                ctx.fillRect(card1X, card2Y, canvas.width - 580, 105);
                ctx.strokeStyle = "#ff7b00";
                ctx.lineWidth = 2;
                ctx.strokeRect(card1X, card2Y, canvas.width - 580, 105);

                ctx.fillStyle = "#ff7b00";
                ctx.font = "bold 20px Arial";
                ctx.fillText("🟠 Turuncu Mermi Efekti", card1X + 20, card2Y + 35);

                ctx.fillStyle = "#cccccc";
                ctx.font = "14px Arial";
                ctx.fillText("Mermileri canlı turuncu renge çevirir.", card1X + 20, card2Y + 65);

                if (!hasOrangeEffect) {
                    drawButton(buyOrangeEffectBtn, (totalCoins >= 250) ? "#00ff66" : "#ff3333", "#34d399", "#000000", "SATIN AL (250)", "13px");
                } else if (isOrangeEffectEquipped) {
                    drawButton(buyOrangeEffectBtn, "#00ff66", "#34d399", "#000000", "SEÇİLİ ✓", "13px");
                } else {
                    drawButton(buyOrangeEffectBtn, "#ffaa00", "#fbbf24", "#000000", "KUŞAN", "13px");
                }

            } else if (shopCategory === 'ozel_guc') {
                const card1X = 290;
                const card1Y = 280;
                ctx.fillStyle = "rgba(0, 210, 255, 0.08)";
                ctx.fillRect(card1X, card1Y, canvas.width - 580, 115);
                ctx.strokeStyle = "#00d2ff";
                ctx.lineWidth = 2;
                ctx.strokeRect(card1X, card1Y, canvas.width - 580, 115);

                ctx.fillStyle = "#ffaa00";
                ctx.font = "bold 22px Arial";
                ctx.fillText("🚀 Çift Mermi Atışı", card1X + 25, card1Y + 38);
                ctx.fillStyle = "#cccccc";
                ctx.font = "15px Arial";
                ctx.fillText("Aynı anda 2 adet lazer fırlatır.", card1X + 25, card1Y + 68);

                if (!hasDoubleShot) {
                    drawButton(buyDoubleShotBtn, (totalCoins >= 1000) ? "#00ff66" : "#ff3333", "#34d399", "#000000", "SATIN AL (1000)", "14px");
                } else if (isDoubleShotEquipped) {
                    drawButton(buyDoubleShotBtn, "#00ff66", "#34d399", "#000000", "SEÇİLİ ✓", "14px");
                } else {
                    drawButton(buyDoubleShotBtn, "#ffaa00", "#fbbf24", "#000000", "KUŞAN", "14px");
                }

                const card2Y = 420;
                ctx.fillStyle = "rgba(0, 255, 102, 0.08)";
                ctx.fillRect(card1X, card2Y, canvas.width - 580, 115);
                ctx.strokeStyle = "#00ff66";
                ctx.lineWidth = 2;
                ctx.strokeRect(card1X, card2Y, canvas.width - 580, 115);

                ctx.fillStyle = "#00ff66";
                ctx.font = "bold 22px Arial";
                ctx.fillText("🧪 Zehirli Mermi (Q Tuşu - 3 Hak)", card1X + 25, card2Y + 38);
                ctx.fillStyle = "#cccccc";
                ctx.font = "15px Arial";
                ctx.fillText("Savaşta Q tuşuna bas, rakibi 4 sn zehirle (Her sn 2 can gider).", card1X + 25, card2Y + 68);

                if (!hasPoisonBullet) {
                    drawButton(buyPoisonBulletBtn, (totalCoins >= 1200) ? "#00ff66" : "#ff3333", "#34d399", "#000000", "SATIN AL (1200)", "14px");
                } else if (isPoisonBulletEquipped) {
                    drawButton(buyPoisonBulletBtn, "#00ff66", "#34d399", "#000000", "SEÇİLİ ✓", "14px");
                } else {
                    drawButton(buyPoisonBulletBtn, "#ffaa00", "#fbbf24", "#000000", "KUŞAN", "14px");
                }
            }

            drawButton(closeShopBtn, "#ff3366", "#fb7185", "#ffffff", "KAPAT", "20px");
        }

        if (isProfileOpen) {
            ctx.fillStyle = "rgba(0, 20, 15, 0.96)";
            ctx.fillRect(200, 70, canvas.width - 400, canvas.height - 140);
            ctx.strokeStyle = "#10b981";
            ctx.lineWidth = 4;
            ctx.strokeRect(200, 70, canvas.width - 400, canvas.height - 140);

            ctx.fillStyle = "#10b981";
            ctx.font = "bold 42px Arial";
            ctx.fillText("👤 OYUNCU PROFİLİ & LİDERLİK TABLOSU", canvas.width / 2 - 380, 135);

            const leftX = 240;
            ctx.fillStyle = "rgba(16, 185, 129, 0.08)";
            ctx.fillRect(leftX, 170, 580, 480);
            ctx.strokeStyle = "#10b981";
            ctx.lineWidth = 2;
            ctx.strokeRect(leftX, 170, 580, 480);

            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 26px Arial";
            ctx.fillText("🎮 İSTATİSTİKLERİN", leftX + 20, 210);

            ctx.fillStyle = "#ffffff";
            ctx.font = "18px Arial";
            ctx.fillText(`• Vurulan Düşman: ${stats.totalEnemiesKilled}`, leftX + 25, 250);
            ctx.fillText(`• Atılan Mermi: ${stats.totalBulletsFired}`, leftX + 25, 280);
            ctx.fillText(`• Kazanılan Maç: ${totalWins}`, leftX + 25, 310);

            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 26px Arial";
            ctx.fillText("🎖️ KAZANILAN ÜNVANLAR", leftX + 20, 370);

            let profY = 410;
            let unlockedTitles = titles.filter(t => t.unlocked);
            if (unlockedTitles.length > 0) {
                unlockedTitles.forEach(t => {
                    ctx.fillStyle = "rgba(0, 255, 102, 0.15)";
                    ctx.fillRect(leftX + 20, profY, 540, 45);
                    ctx.strokeStyle = "#00ff66";
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(leftX + 20, profY, 540, 45);

                    ctx.fillStyle = "#00ff66";
                    ctx.font = "bold 18px Arial";
                    ctx.fillText(t.name, leftX + 35, profY + 28);
                    profY += 55;
                });
            } else {
                ctx.fillStyle = "#ffaa00";
                ctx.font = "18px Arial";
                ctx.fillText("Henüz bir ünvan kazanılmadı.", leftX + 25, profY + 20);
            }

            const rightX = 860;
            const rightWidth = canvas.width - 1100;
            ctx.fillStyle = "rgba(255, 215, 0, 0.08)";
            ctx.fillRect(rightX, 170, rightWidth, 480);
            ctx.strokeStyle = "#ffd700";
            ctx.lineWidth = 2;
            ctx.strokeRect(rightX, 170, rightWidth, 480);

            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 26px Arial";
            ctx.fillText("🥇 UZAY LİDERLİK TABLOSU", rightX + 20, 210);

            let hamzaScore = (stats.totalEnemiesKilled * 100) + (totalWins * 500);

            const leaderboardData = [
                { rank: "1. 🥇", name: "Kaptan Hamza (SEN)", score: `${hamzaScore} P` },
                { rank: "2. 🥈", name: "Göktaşı Avcısı X", score: "4200 P" },
                { rank: "3. 🥉", name: "Galaksi Koruyucusu", score: "3100 P" },
                { rank: "4. 🎖️", name: "Uzay Şahini", score: "2400 P" },
                { rank: "5. 🎖️", name: "Karanlık Lazer", score: "1500 P" }
            ];

            let lbY = 260;
            leaderboardData.forEach(p => {
                ctx.fillStyle = p.name.includes("SEN") ? "rgba(0, 255, 102, 0.2)" : "rgba(255, 255, 255, 0.05)";
                ctx.fillRect(rightX + 15, lbY, rightWidth - 30, 55);
                ctx.strokeStyle = p.name.includes("SEN") ? "#00ff66" : "#444";
                ctx.lineWidth = 1.5;
                ctx.strokeRect(rightX + 15, lbY, rightWidth - 30, 55);

                ctx.fillStyle = p.name.includes("SEN") ? "#00ff66" : "#ffffff";
                ctx.font = "bold 20px Arial";
                ctx.fillText(`${p.rank}  ${p.name}`, rightX + 30, lbY + 34);

                ctx.fillStyle = "#ffd700";
                ctx.font = "bold 20px Arial";
                ctx.fillText(p.score, rightX + rightWidth - 140, lbY + 34);

                lbY += 70;
            });

            drawButton(closeProfileBtn, "#ff3366", "#fb7185", "#ffffff", "KAPAT", "20px");
        }

        if (isWarriorsOpen) {
            ctx.fillStyle = "rgba(5, 5, 20, 0.95)";
            ctx.fillRect(150, 100, canvas.width - 300, canvas.height - 200);
            ctx.strokeStyle = "#ffaa00";
            ctx.lineWidth = 4;
            ctx.strokeRect(150, 100, canvas.width - 300, canvas.height - 200);

            ctx.fillStyle = "#ffaa00";
            ctx.font = "bold 40px Arial";
            ctx.fillText("🛡️ UZAY SAVAŞÇILARI", canvas.width / 2 - 200, 160);

            const cardWidth = 340;
            const cardHeight = 370;
            const cardY = 210;

            let card1X = 200;
            ctx.fillStyle = "rgba(0, 210, 255, 0.1)";
            ctx.fillRect(card1X, cardY, cardWidth, cardHeight);
            ctx.strokeStyle = "#00d2ff";
            ctx.lineWidth = 2;
            ctx.strokeRect(card1X, cardY, cardWidth, cardHeight);

            if (playerImg.complete && playerImg.naturalWidth !== 0) {
                ctx.drawImage(playerImg, card1X + 115, cardY + 25, 110, 130);
            }
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 22px Arial";
            ctx.fillText("Kaptan Hamza", card1X + 90, cardY + 190);
            ctx.fillStyle = "#00ff66";
            ctx.font = "16px Arial";
            ctx.fillText("❤️ Sağlık: 100 HP", card1X + 105, cardY + 225);
            ctx.fillText("⚡ Hız: Dengeli (9)", card1X + 105, cardY + 252);

            if (selectedWarrior === 'hamza') {
                drawButton(selectHamzaBtn, "#00ff66", "#34d399", "#000000", "SEÇİLDİ ✓", "16px");
            } else {
                drawButton(selectHamzaBtn, "#ffaa00", "#fbbf24", "#000000", "SEÇ", "16px");
            }

            let card2X = 575;
            ctx.fillStyle = "rgba(157, 78, 221, 0.1)";
            ctx.fillRect(card2X, cardY, cardWidth, cardHeight);
            ctx.strokeStyle = "#9d4edd";
            ctx.lineWidth = 2;
            ctx.strokeRect(card2X, cardY, cardWidth, cardHeight);

            if (alienImg.complete && alienImg.naturalWidth !== 0) {
                ctx.drawImage(alienImg, card2X + 110, cardY + 25, 120, 130);
            }
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 22px Arial";
            ctx.fillText("Uzaylı Savaşçı", card2X + 98, cardY + 190);
            ctx.fillStyle = "#c77dff";
            ctx.font = "16px Arial";
            ctx.fillText("❤️ Sağlık: 105 HP", card2X + 105, cardY + 225);
            ctx.fillText("⚡ Hız: Dengeli (9)", card2X + 105, cardY + 252);

            if (!hasAlienWarrior) {
                drawButton(selectAlienBtn, "#ff3333", "#ff3333", "#ffffff", "🔒 DÜKKANDA", "15px", true);
            } else if (selectedWarrior === 'alien') {
                drawButton(selectAlienBtn, "#00ff66", "#34d399", "#000000", "SEÇİLDİ ✓", "16px");
            } else {
                drawButton(selectAlienBtn, "#ffaa00", "#fbbf24", "#000000", "SEÇ", "16px");
            }

            let card3X = 950;
            ctx.fillStyle = "rgba(255, 170, 0, 0.1)";
            ctx.fillRect(card3X, cardY, cardWidth, cardHeight);
            ctx.strokeStyle = "#ffaa00";
            ctx.lineWidth = 2;
            ctx.strokeRect(card3X, cardY, cardWidth, cardHeight);

            if (dogImg.complete && dogImg.naturalWidth !== 0) {
                ctx.drawImage(dogImg, card3X + 100, cardY + 25, 140, 130);
            }
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 22px Arial";
            ctx.fillText("Uzay Köpeği", card3X + 105, cardY + 190);
            ctx.fillStyle = "#ffd700";
            ctx.font = "16px Arial";
            ctx.fillText("❤️ Sağlık: 85 HP", card3X + 105, cardY + 225);
            ctx.fillText("⚡ Hız: Çevik (12)", card3X + 105, cardY + 252);

            if (!hasDogWarrior) {
                drawButton(selectDogBtn, "#ff3333", "#ff3333", "#ffffff", "🔒 DÜKKANDA", "15px", true);
            } else if (selectedWarrior === 'dog') {
                drawButton(selectDogBtn, "#00ff66", "#34d399", "#000000", "SEÇİLDİ ✓", "16px");
            } else {
                drawButton(selectDogBtn, "#ffaa00", "#fbbf24", "#000000", "SEÇ", "16px");
            }

            drawButton(closeWarriorsBtn, "#ff3366", "#fb7185", "#ffffff", "KAPAT", "20px");
        }

        if (isHelpOpen) {
            ctx.fillStyle = "rgba(5, 5, 25, 0.96)";
            ctx.fillRect(200, 100, canvas.width - 400, canvas.height - 200);
            ctx.strokeStyle = "#a855f7";
            ctx.lineWidth = 4;
            ctx.strokeRect(200, 100, canvas.width - 400, canvas.height - 200);
            ctx.fillStyle = "#a855f7";
            ctx.font = "bold 38px Arial";
            ctx.fillText("❓ OYUN REHBERİ VE BİLGİLER", canvas.width / 2 - 270, 165);
            ctx.fillStyle = "#ffffff";
            ctx.font = "21px Arial";
            let startY = 240;
            const lineHeight = 42;
            ctx.fillText("🎮  KONTROLLER: Sol/Sağ ok tuşları ile hareket.", 250, startY);
            ctx.fillText("🚀  ATEŞ ETME: Boşluk (Space) tuşuyla lazer fırlat.", 250, startY + lineHeight);
            ctx.fillText("⌨️  HIZLI GEÇİŞ: Zafer ekranında (S) tuşuna basarak hızlıca ilerle.", 250, startY + lineHeight * 2);
            ctx.fillText("🚀  UZAY İSTASYONU: Güneş, Gezegenler ve Telsizden haberleri oku.", 250, startY + lineHeight * 3);
            
            drawButton(closeHelpBtn, "#a855f7", "#c084fc", "#ffffff", "ANLADIM", "20px");
        }
        return;
    }

    if (gameState === 'other_modes') {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!isBotVsMode) {
            ctx.fillStyle = "#7209b7";
            ctx.font = "bold 54px Arial";
            ctx.fillText("DİĞER MODLAR", canvas.width / 2 - 190, 220);

            drawButton(trainingModeBtn, "#7209b7", "#9d4edd", "#ffffff", "🎯 EĞİTİM ALANI", "26px");
            drawButton(botVsModeBtn, "#00d2ff", "#38bdf8", "#000000", "🤖 BOT VS (BİREBİR SAVAŞ)", "24px");
            drawButton(backToMenuBtn, "#ff3366", "#fb7185", "#ffffff", "GERİ DÖN", "23px");
        } else {
            if (botVsState === 'select_char') {
                ctx.fillStyle = "#00d2ff";
                ctx.font = "bold 44px Arial";
                ctx.fillText("🤖 RAKİBİN HANGİ KARAKTER OLSUN?", canvas.width / 2 - 350, 180);

                drawButton(botHamzaBtn, "#1e293b", "#38bdf8", "#ffffff", "👨‍🚀 KAPTAN HAMZA", "20px");
                drawButton(botAlienBtn, "#1e293b", "#9d4edd", "#ffffff", "👽 UZAYLI SAVAŞÇI", "20px");
                drawButton(botDogBtn, "#1e293b", "#ffaa00", "#ffffff", "🐶 UZAY KÖPEĞİ", "20px");

            } else if (botVsState === 'select_diff') {
                ctx.fillStyle = "#ffaa00";
                ctx.font = "bold 44px Arial";
                ctx.fillText("⚡ YAPAY ZEKA ZORLUK SEVİYESİ", canvas.width / 2 - 280, 180);

                drawButton(diffKolayBtn, "#10b981", "#34d399", "#000000", "🟢 KOLAY (5 Akçe)", "22px");
                drawButton(diffOrtaBtn, "#f59e0b", "#fbbf24", "#000000", "🟡 ORTA (10 Akçe)", "22px");
                drawButton(diffZorBtn, "#ef4444", "#f87171", "#ffffff", "🔴 ZOR (15 Akçe)", "22px");
            }

            drawButton(backToMenuBtn, "#ff3366", "#fb7185", "#ffffff", "GERİ DÖN", "23px");
        }

        return;
    }

    if (gameState === 'level_select') {
        ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = levelPage === 1 ? "#00d2ff" : "#e056fd";
        ctx.font = "bold 50px Arial";
        ctx.fillText(levelPage === 1 ? "1. SAYFA: 1 - 10 SEVİYELER" : "🌕 2. SAYFA: AY (11 - 30 SEVİYELER)", canvas.width / 2 - 330, 140);

        if (levelPage === 1) {
            for (let i = 0; i < page1GridBtns.length; i++) {
                let btn = page1GridBtns[i];
                let lvlNum = i + 1;

                let isLocked = (unlockedLevel < lvlNum);
                let color = "#00ff66";
                if (lvlNum >= 5 && lvlNum <= 9) color = "#ffaa00";
                if (lvlNum === 10) color = "#e056fd";

                drawButton(btn, color, "#38bdf8", isLocked ? "#94a3b8" : "#000000", isLocked ? `🔒 ${lvlNum}` : `SEVİYE ${lvlNum}`, "16px", isLocked);
            }
        } else if (levelPage === 2) {
            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 18px Arial";
            ctx.fillText("⬆️ ÜST SIRA (11 - 20) | ⬇️ ALT SIRA (21 - 30)", canvas.width / 2 - 200, 185);

            for (let i = 0; i < page2GridBtns.length; i++) {
                let btn = page2GridBtns[i];
                let lvlNum = 11 + i;

                let isLocked = (lvlNum > unlockedLevel) || !completedUniqueLevels.includes(10);
                let color = lvlNum <= 20 ? "#7209b7" : "#3a86ff";

                drawButton(btn, color, "#c084fc", isLocked ? "#94a3b8" : "#ffffff", isLocked ? `🔒 ${lvlNum}` : `SEVİYE ${lvlNum}`, "14px", isLocked);
            }
        }

        if (levelPage === 1) {
            drawButton(nextPageBtn, "#3a86ff", "#60a5fa", "#ffffff", "➡️", "22px");
        } else {
            drawButton(prevPageBtn, "#3a86ff", "#60a5fa", "#ffffff", "⬅️", "22px");
        }

        drawButton(backToMenuBtn, "#ff3366", "#fb7185", "#ffffff", "GERİ DÖN", "20px");

        return;
    }

    enemies.forEach(enemy => {
        if (enemy.isBotEnemy) {
            let botImg = playerImg;
            if (enemy.botCharType === 'alien' && alienImg.complete && alienImg.naturalWidth !== 0) botImg = alienImg;
            if (enemy.botCharType === 'dog' && dogImg.complete && dogImg.naturalWidth !== 0) botImg = dogImg;

            if (botImg.complete && botImg.naturalWidth !== 0) {
                ctx.drawImage(botImg, enemy.x, enemy.y, enemy.width, enemy.height);
            } else {
                ctx.fillStyle = enemy.color;
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            }
        } else {
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y + 14, enemy.width, enemy.height - 14);
            ctx.fillStyle = "#1d3557";
            ctx.fillRect(enemy.x + (enemy.width / 2) - (enemy.isBoss || enemy.isSinsiBoss ? 40 : 20), enemy.y, enemy.isBoss || enemy.isSinsiBoss ? 80 : 40, 14);
        }

        const barWidth = enemy.width;
        const hpWidth = (enemy.hp / enemy.maxHp) * barWidth;
        ctx.fillStyle = "#000000";
        ctx.fillRect(enemy.x, enemy.y - 22, barWidth, 12);
        ctx.fillStyle = (enemy.isBoss || enemy.isSinsiBoss || currentLevel >= 6) ? "#ff0055" : "#00ff66";
        ctx.fillRect(enemy.x, enemy.y - 22, hpWidth, 12);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(enemy.x, enemy.y - 22, barWidth, 12);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Arial";
        ctx.fillText(enemy.hp + "/" + enemy.maxHp, enemy.x + 2, enemy.y - 25);

        if (enemy.isBotEnemy) {
            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 14px Arial";
            let botName = enemy.botCharType === 'alien' ? "YAPAY ZEKA (UZAYLI)" : enemy.botCharType === 'dog' ? "YAPAY ZEKA (KÖPEK)" : "YAPAY ZEKA (HAMZA)";
            ctx.fillText(`🧠 ${botName}`, enemy.x - 30, enemy.y - 38);
        } else if (enemy.isSinsiBoss) {
            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 15px Arial";
            ctx.fillText("☠️ SİNSİ BOSS", enemy.x + enemy.width / 2 - 50, enemy.y - 38);
        } else if (enemy.isBoss) {
            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 16px Arial";
            ctx.fillText("👑 DEV BOSS (YELPAZE SALDIRISI)", enemy.x + enemy.width / 2 - 110, enemy.y - 38);
        } else if (currentLevel >= 11) {
            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 12px Arial";
            ctx.fillText("🌕 AY DÜŞMANI", enemy.x + enemy.width / 2 - 35, enemy.y - 38);
        }
    });

    enemyBullets.forEach(eb => {
        ctx.fillStyle = eb.color;
        ctx.shadowColor = eb.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(eb.x, eb.y, eb.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    if (!isBotVsMode) {
        apples.forEach(apple => {
            ctx.fillStyle = "#ffd700";
            ctx.shadowColor = "#ffea00";
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(apple.x + apple.size / 2, apple.y + apple.size / 2, apple.size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#228b22";
            ctx.shadowBlur = 0;
            ctx.fillRect(apple.x + apple.size / 2 - 2, apple.y - 6, 4, 12);
        });
    }

    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.shadowColor = bullet.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
    });

    let currentWarriorImg = playerImg;
    if (selectedWarrior === 'dog' && dogImg.complete && dogImg.naturalWidth !== 0) {
        currentWarriorImg = dogImg;
    } else if (selectedWarrior === 'alien' && alienImg.complete && alienImg.naturalWidth !== 0) {
        currentWarriorImg = alienImg;
    }

    if (currentWarriorImg.complete && currentWarriorImg.naturalWidth !== 0) {
        ctx.drawImage(currentWarriorImg, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = "#00d2ff";
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 21px Arial";
    ctx.fillText("TOPLAM CAN:", 45, 52);
    ctx.fillStyle = "#222222";
    ctx.fillRect(205, 30, 240, 26);
    ctx.fillStyle = player.hp > (player.maxHp * 0.3) ? "#00ff66" : "#ff3333";
    ctx.fillRect(205, 30, (player.hp / player.maxHp) * 240, 26);
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(205, 30, 240, 26);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.fillText(player.hp + " / " + player.maxHp, 295, 48);

    if (isTrainingMode) {
        ctx.fillStyle = "#7209b7";
        ctx.font = "bold 22px Arial";
        ctx.fillText("🎯 EĞİTİM ALANI", canvas.width / 2 - 80, 52);

        drawButton(exitTrainingBtn, "#ff3366", "#fb7185", "#ffffff", "🚪 ÇIKIŞ", "18px");
    } else if (isBotVsMode) {
        ctx.fillStyle = "#00d2ff";
        ctx.font = "bold 22px Arial";
        ctx.fillText(`🧠 YAPAY ZEKA SAVAŞI (${botDifficulty.toUpperCase()})`, canvas.width / 2 - 160, 52);

        drawButton(exitTrainingBtn, "#ff3366", "#fb7185", "#ffffff", "🚪 ÇIKIŞ", "18px");
    } else {
        ctx.fillStyle = currentLevel >= 11 ? "#e056fd" : "#00d2ff";
        ctx.font = "bold 21px Arial";
        ctx.fillText(currentLevel >= 11 ? `🌕 SEVİYE: ${currentLevel} (AY GÖREVİ)` : "SEVİYE: " + currentLevel, canvas.width - 350, 52);
    }

    if (hasPoisonBullet && isPoisonBulletEquipped) {
        ctx.fillStyle = isPoisonActive ? "#00ff66" : "#ffffff";
        ctx.font = "bold 18px Arial";
        ctx.fillText(`🧪 Zehir Hakkı: ${poisonAmmoCount}/3 ${isPoisonActive ? "(Q Aktif!)" : "(Q'ya Bas)"}`, canvas.width / 2 - 130, 85);
    }

    if (poisonTimer > 0) {
        ctx.fillStyle = "#00ff66";
        ctx.font = "bold 24px Arial";
        ctx.fillText("☣️ RAKİP ZEHİRLİ!", canvas.width / 2 - 100, 115);
    }

    if (appleNotificationTimer > 0) {
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 32px Arial";
        ctx.fillText("🍎 +5 CAN KAZANILDI!", canvas.width / 2 - 160, 115);
    }

    if (gameState === 'win') {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00ff66";
        ctx.font = "bold 58px Arial";
        let winText = isTrainingMode ? "EĞİTİM TAMAMLANDI!" : isBotVsMode ? "YAPAY ZEKA MAĞLUP EDİLDİ!" : `SEVİYE ${currentLevel} TAMAMLANDI!`;
        ctx.fillText(winText, canvas.width / 2 - 340, canvas.height / 2 - 110);

        if (!isTrainingMode) {
            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 32px Arial";
            let earnedCoins = currentLevel * 10;
            if (isBotVsMode) {
                if (botDifficulty === 'kolay') earnedCoins = 5;
                else if (botDifficulty === 'orta') earnedCoins = 10;
                else if (botDifficulty === 'zor') earnedCoins = 15;
            }
            ctx.fillText("🪙 +" + earnedCoins + " Akçe Kazandın!", canvas.width / 2 - 160, canvas.height / 2 - 50);
        }

        if (!isBotVsMode && currentLevel < 30) {
            drawButton(nextLevelBtn, "#00d2ff", "#38bdf8", "#000000", `SONRAKİ SEVİYE (${currentLevel + 1}) ➡️ (S)`, "20px");
        }

        drawButton(restartBtn, "#00ff66", "#34d399", "#000000", "TEKRAR OYNA (R)", "20px");
        drawButton(menuBtn, "#ffaa00", "#fbbf24", "#000000", "ANA EKRANA DÖN (M)", "20px");
    }

    if (gameState === 'gameover') {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ff3366";
        ctx.font = "bold 64px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 195, canvas.height / 2 - 80);

        drawButton(restartBtn, "#00d2ff", "#38bdf8", "#000000", "RESTART (R)", "22px");
        drawButton(menuBtn, "#ffaa00", "#fbbf24", "#000000", "ANA EKRANA DÖN (M)", "21px");
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();