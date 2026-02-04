// Tab navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// ========= NOMOR 1 =========
// OPERASI MATRIKS

function createMatrixInput(name) {
    const rows = parseInt(document.getElementById(`${name}-rows`).value);
    const cols = parseInt(document.getElementById(`${name}-cols`).value);
    const container = document.getElementById(`${name}-matrix-input`);
    
    container.innerHTML = '';
    
    for (let i = 0; i < rows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';
        
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.id = `${name}-${i}-${j}`;
            input.placeholder = `[${i+1}][${j+1}]`;
            rowDiv.appendChild(input);
        }
        
        container.appendChild(rowDiv);
    }
}

function getMatrix(name) {
    const rows = parseInt(document.getElementById(`${name}-rows`).value);
    const cols = parseInt(document.getElementById(`${name}-cols`).value);
    const matrix = [];
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const value = parseFloat(document.getElementById(`${name}-${i}-${j}`).value) || 0;
            row.push(value);
        }
        matrix.push(row);
    }
    
    return matrix;
}

function printMatrix(m, container) {
    container.appendChild(renderBracketMatrix(m));
}

function transpose(m) {
    const result = [];
    for (let j = 0; j < m[0].length; j++) {
        const row = [];
        for (let i = 0; i < m.length; i++) {
            row.push(m[i][j]);
        }
        result.push(row);
    }
    return result;
}

function addMatrix(A, B, container) {
    const stepsDiv = document.createElement('div');
    stepsDiv.className = 'operation-steps';
    stepsDiv.innerHTML = '<h4>Visualisasi Penjumlahan A + B:</h4>';
    
    const result = [];
    const intermediateMatrix = [];
    
    for (let i = 0; i < A.length; i++) {
        const row = [];
        const interRow = [];
        for (let j = 0; j < A[0].length; j++) {
            const valA = A[i][j];
            const valB = B[i][j];
            const sum = valA + valB;
            
            row.push(sum);
            
            // Format intermediate step: (a) + (b) if negative
            const strA = valA < 0 ? `(${valA})` : valA;
            const strB = valB < 0 ? `(${valB})` : valB;
            interRow.push(`${strA} + ${strB}`);
        }
        result.push(row);
        intermediateMatrix.push(interRow);
    }
    
    // Create Equation Visual: [A] + [B] = [Intermediate] = [Result]
    const opContainer = document.createElement('div');
    opContainer.className = 'matrix-op-container';
    
    // Matrix A
    opContainer.appendChild(renderBracketMatrix(A));
    
    // + symbol
    const plus = document.createElement('div');
    plus.className = 'matrix-op-symbol';
    plus.textContent = '+';
    opContainer.appendChild(plus);
    
    // Matrix B
    opContainer.appendChild(renderBracketMatrix(B));
    
    // = symbol
    const eq1 = document.createElement('div');
    eq1.className = 'matrix-op-symbol';
    eq1.textContent = '=';
    opContainer.appendChild(eq1);
    
    // Intermediate Matrix (show calculation)
    opContainer.appendChild(renderBracketMatrix(intermediateMatrix));
    
    // = symbol
    const eq2 = document.createElement('div');
    eq2.className = 'matrix-op-symbol';
    eq2.textContent = '=';
    opContainer.appendChild(eq2);
    
    // Result Matrix
    opContainer.appendChild(renderBracketMatrix(result));
    
    stepsDiv.appendChild(opContainer);
    container.appendChild(stepsDiv);
    
    return result;
}

function multiplyMatrix(A, B, container) {
    const stepsDiv = document.createElement('div');
    stepsDiv.className = 'operation-steps';
    
    const result = [];
    for (let i = 0; i < A.length; i++) {
        result.push(new Array(B[0].length).fill(0));
    }
    
    // 1. Visual Equation: [A] x [B] = [?]
    const opContainer = document.createElement('div');
    opContainer.className = 'matrix-op-container';
    opContainer.innerHTML = '<h4>Perkalian Matriks A × B:</h4>';
    opContainer.style.width = '100%';
    opContainer.style.justifyContent = 'flex-start';
    
    const eqContainer = document.createElement('div');
    eqContainer.className = 'matrix-op-container';
    
    eqContainer.appendChild(renderBracketMatrix(A));
    
    const times = document.createElement('div');
    times.className = 'matrix-op-symbol';
    times.textContent = '×';
    eqContainer.appendChild(times);
    
    eqContainer.appendChild(renderBracketMatrix(B));
    
    const eq = document.createElement('div');
    eq.className = 'matrix-op-symbol';
    eq.textContent = '=';
    eqContainer.appendChild(eq);
    
    // Placeholder for result (will be filled later if needed, or just show steps)
    const resultPlaceholder = document.createElement('div');
    resultPlaceholder.innerHTML = '<span style="font-size:2em; color:#ccc;">?</span>';
    eqContainer.appendChild(resultPlaceholder);
    
    stepsDiv.appendChild(opContainer);
    stepsDiv.appendChild(eqContainer);

    // 2. Detailed Calculation Steps
    const detailsContainer = document.createElement('div');
    detailsContainer.innerHTML = '<h4>Rincian Perhitungan per Elemen:</h4>';
    
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            const stepRow = document.createElement('div');
            stepRow.className = 'matrix-calc-row';
            
            // Header: Element [i+1][j+1]
            const header = document.createElement('span');
            header.className = 'calc-header';
            header.textContent = `Elemen Baris ${i+1}, Kolom ${j+1} (c${i+1}${j+1}):`;
            stepRow.appendChild(header);
            
            // Calculation: (Row A) . (Col B)
            // Show formula: (a1)(b1) + (a2)(b2) + ...
            let total = 0;
            const formulaParts = [];
            const calcParts = [];
            
            for (let k = 0; k < B.length; k++) {
                const valA = A[i][k];
                const valB = B[k][j];
                const prod = valA * valB;
                total += prod;
                
                const strA = valA < 0 ? `(${valA})` : valA;
                const strB = valB < 0 ? `(${valB})` : valB;
                
                formulaParts.push(`(${strA} × ${strB})`);
                calcParts.push(prod);
            }
            
            result[i][j] = total;
            
            const detail = document.createElement('div');
            detail.className = 'calc-detail';
            detail.innerHTML = `
                = ${formulaParts.join(' + ')} <br>
                = ${calcParts.map(p => p < 0 ? `(${p})` : p).join(' + ')} <br>
                = <span class="calc-result">${total}</span>
            `;
            stepRow.appendChild(detail);
            detailsContainer.appendChild(stepRow);
        }
    }
    
    stepsDiv.appendChild(detailsContainer);
    
    // 3. Final Result
    const finalResultDiv = document.createElement('div');
    finalResultDiv.innerHTML = '<h4>Hasil Akhir Perkalian:</h4>';
    finalResultDiv.style.marginTop = '20px';
    printMatrix(result, finalResultDiv);
    
    // Replace the placeholder ? with the actual result in the top equation
    resultPlaceholder.innerHTML = '';
    resultPlaceholder.appendChild(renderBracketMatrix(result));
    
    stepsDiv.appendChild(finalResultDiv);
    container.appendChild(stepsDiv);
    
    return result;
}

function calculateMatrixOperations() {
    const resultsDiv = document.getElementById('matrix-results');
    resultsDiv.innerHTML = '';
    
    try {
        const A = getMatrix('A');
        const B = getMatrix('B');
        const C = getMatrix('C');
        
        // Check if matrices are filled
        if (A.length === 0 || B.length === 0 || C.length === 0) {
            resultsDiv.innerHTML = '<div class="error">Silakan buat semua matriks terlebih dahulu!</div>';
            return;
        }
        
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'results';
        
        // Hitung CA
        if (C[0].length === A.length) {
            const caDiv = document.createElement('div');
            caDiv.innerHTML = '<h3>=== Menghitung CA ===</h3>';
            multiplyMatrix(C, A, caDiv);
            resultsContainer.appendChild(caDiv);
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = 'CA tidak dapat dihitung';
            resultsContainer.appendChild(errorDiv);
        }
        
        // Hitung A^T(A+B)
        if (A.length === B.length && A[0].length === B[0].length) {
            const atabDiv = document.createElement('div');
            atabDiv.innerHTML = '<h3>=== Menghitung A^T (A + B) ===</h3>';
            
            const A_plus_B = addMatrix(A, B, atabDiv);
            const AT = transpose(A);
            
            const transposeDiv = document.createElement('div');
            transposeDiv.innerHTML = '<h4>Transpose matriks A:</h4>';
            printMatrix(AT, transposeDiv);
            atabDiv.appendChild(transposeDiv);
            
            if (AT[0].length === A_plus_B.length) {
                multiplyMatrix(AT, A_plus_B, atabDiv);
            } else {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error';
                errorDiv.textContent = 'A^T(A+B) tidak dapat dihitung';
                atabDiv.appendChild(errorDiv);
            }
            
            resultsContainer.appendChild(atabDiv);
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = 'A^T(A+B) tidak dapat dihitung';
            resultsContainer.appendChild(errorDiv);
        }
        
        // Hitung (CB)^T
        if (C[0].length === B.length) {
            const cbtDiv = document.createElement('div');
            cbtDiv.innerHTML = '<h3>=== Menghitung (CB)^T ===</h3>';
            
            const CB = multiplyMatrix(C, B, cbtDiv);
            
            const transposeDiv = document.createElement('div');
            transposeDiv.innerHTML = '<h4>Transpose matriks CB:</h4>';
            printMatrix(transpose(CB), transposeDiv);
            cbtDiv.appendChild(transposeDiv);
            
            resultsContainer.appendChild(cbtDiv);
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = '(CB)^T tidak dapat dihitung';
            resultsContainer.appendChild(errorDiv);
        }
        
        resultsDiv.appendChild(resultsContainer);
        
    } catch (error) {
        resultsDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

// ========= NOMOR 2 =========
// OPERASI BARIS ELEMENTER (INVERS)

function formatNumber(value) {
    // Tampilkan bilangan bulat sebagai integer, desimal jadi pecahan sederhana (mis. -2/3)
    if (!Number.isFinite(value)) return String(value);
    const roundedInt = Math.round(value);
    if (Math.abs(value - roundedInt) < 1e-10) return String(roundedInt);

    const { n, d } = toRational(value, { maxDen: 1000, tol: 1e-10 });
    if (d === 1) return String(n);
    return `${n}/${d}`;
}

function createFractionElement(value) {
    // Digunakan untuk tampilan matriks (pecahan bertumpuk seperti gambar)
    const span = document.createElement('span');
    span.className = 'matrix-frac';

    if (!Number.isFinite(value)) {
        span.textContent = String(value);
        return span;
    }

    const { n, d } = toRational(value, { maxDen: 1000, tol: 1e-10 });

    // Bilangan bulat
    if (d === 1) {
        span.textContent = String(n);
        return span;
    }

    const sign = n < 0 ? '-' : '';
    const absN = Math.abs(n);

    const signNode = document.createTextNode(sign);
    span.appendChild(signNode);

    const fracBody = document.createElement('span');
    fracBody.className = 'matrix-frac-body';

    const numSpan = document.createElement('span');
    numSpan.className = 'matrix-frac-num';
    numSpan.textContent = String(absN);

    const denSpan = document.createElement('span');
    denSpan.className = 'matrix-frac-den';
    denSpan.textContent = String(d);

    fracBody.appendChild(numSpan);
    fracBody.appendChild(denSpan);
    span.appendChild(fracBody);

    return span;
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const t = a % b;
        a = b;
        b = t;
    }
    return a;
}

function toRational(x, { maxDen = 1000, tol = 1e-10 } = {}) {
    // Continued fraction approximation, returns reduced n/d with d <= maxDen
    if (!Number.isFinite(x)) return { n: x, d: 1 };

    const sign = x < 0 ? -1 : 1;
    let value = Math.abs(x);

    // If very close to integer
    const nearInt = Math.round(value);
    if (Math.abs(value - nearInt) < tol) return { n: sign * nearInt, d: 1 };

    // Continued fraction convergents
    let h1 = 1, h0 = 0;
    let k1 = 0, k0 = 1;
    let b = value;

    for (let iter = 0; iter < 50; iter++) {
        const a = Math.floor(b);
        const h2 = a * h1 + h0;
        const k2 = a * k1 + k0;

        if (k2 > maxDen) break;

        h0 = h1; h1 = h2;
        k0 = k1; k1 = k2;

        const approx = h1 / k1;
        if (Math.abs(approx - value) < tol) break;

        const frac = b - a;
        if (frac < tol) break;
        b = 1 / frac;
    }

    let n = sign * h1;
    let d = k1;

    const g = gcd(n, d) || 1;
    n /= g;
    d /= g;

    // Normalize sign to numerator
    if (d < 0) { d = -d; n = -n; }

    return { n, d };
}

function renderBracketMatrix(mat, { splitAt = null } = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'matrix-bracket';

    const nCols = mat[0]?.length ?? 0;
    const splitIndex = splitAt != null ? splitAt : null;

    mat.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-bracket-row';

        const leftBracket = document.createElement('span');
        leftBracket.className = 'matrix-bracket-side';
        leftBracket.textContent = '[';
        rowDiv.appendChild(leftBracket);

        const cellsContainer = document.createElement('div');
        cellsContainer.className = 'matrix-bracket-cells';

        row.forEach((value, idx) => {
            if (splitIndex !== null && idx === splitIndex) {
                const bar = document.createElement('span');
                bar.className = 'matrix-bracket-bar dashed';
                cellsContainer.appendChild(bar);
            }

            const cell = document.createElement('span');
            cell.className = 'matrix-bracket-cell';
            cell.appendChild(createFractionElement(value));
            cellsContainer.appendChild(cell);
        });

        rowDiv.appendChild(cellsContainer);

        const rightBracket = document.createElement('span');
        rightBracket.className = 'matrix-bracket-side';
        rightBracket.textContent = ']';
        rowDiv.appendChild(rightBracket);

        wrapper.appendChild(rowDiv);
    });

    return wrapper;
}

function createInverseMatrixInput() {
    const n = parseInt(document.getElementById('inverse-n').value);
    const container = document.getElementById('inverse-matrix-input');
    
    container.innerHTML = '';
    
    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix-grid';
    
    for (let i = 0; i < n; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';
        
        for (let j = 0; j < n; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.id = `inv-${i}-${j}`;
            input.placeholder = `[${i+1}][${j+1}]`;
            input.step = 'any';
            rowDiv.appendChild(input);
        }
        
        matrixDiv.appendChild(rowDiv);
    }
    
    container.appendChild(matrixDiv);
}

function getInverseMatrix() {
    const n = parseInt(document.getElementById('inverse-n').value);
    const matrix = [];
    
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            const value = parseFloat(document.getElementById(`inv-${i}-${j}`).value) || 0;
            row.push(value);
        }
        matrix.push(row);
    }
    
    return matrix;
}

function printMatrixOBE(mat, container) {
    const nCols = mat[0]?.length ?? 0;
    const splitAt = Number.isInteger(nCols / 2) ? nCols / 2 : null;
    container.appendChild(renderBracketMatrix(mat, { splitAt }));
}

function inverseMatrixWithSteps(matrix) {
    const n = matrix.length;
    const aug = [];
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'operation-steps';
    
    // Create augmented matrix [A | I]
    for (let i = 0; i < n; i++) {
        const row = [...matrix[i]];
        for (let j = 0; j < n; j++) {
            row.push(i === j ? 1 : 0);
        }
        aug.push(row);
    }
    
    stepsContainer.innerHTML = '<h4>Matriks awal [A | I]:</h4>';
    printMatrixOBE(aug, stepsContainer);
    
    // Gaussian elimination
    for (let i = 0; i < n; i++) {
        // Find pivot
        if (Math.abs(aug[i][i]) < 1e-10) {
            // Swap rows
            let found = false;
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(aug[j][i]) > 1e-10) {
                    const stepDiv = document.createElement('div');
                    stepDiv.className = 'step';
                    stepDiv.textContent = `Tukar B${i+1} dengan B${j+1}`;
                    stepsContainer.appendChild(stepDiv);
                    
                    [aug[i], aug[j]] = [aug[j], aug[i]];
                    printMatrixOBE(aug, stepsContainer);
                    found = true;
                    break;
                }
            }
            if (!found) {
                throw new Error('Matriks tidak memiliki invers');
            }
        }
        
        // Normalize pivot row
        const pivot = aug[i][i];
        const stepDiv1 = document.createElement('div');
        stepDiv1.className = 'step';
        stepDiv1.textContent = `Bagi B${i+1} dengan ${formatNumber(pivot)}`;
        stepsContainer.appendChild(stepDiv1);
        
        for (let k = 0; k < 2 * n; k++) {
            aug[i][k] /= pivot;
        }
        printMatrixOBE(aug, stepsContainer);
        
        // Eliminate column
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                const factor = aug[j][i];
                if (Math.abs(factor) > 1e-10) {
                    const stepDiv2 = document.createElement('div');
                    stepDiv2.className = 'step';
                    stepDiv2.textContent = `B${j+1} = B${j+1} - (${formatNumber(factor)})B${i+1}`;
                    stepsContainer.appendChild(stepDiv2);
                    
                    for (let k = 0; k < 2 * n; k++) {
                        aug[j][k] -= factor * aug[i][k];
                    }
                    printMatrixOBE(aug, stepsContainer);
                }
            }
        }
    }
    
    // Extract inverse matrix
    const inverse = [];
    for (let i = 0; i < n; i++) {
        inverse.push(aug[i].slice(n));
    }
    
    return { inverse, steps: stepsContainer };
}

function calculateInverse() {
    const resultsDiv = document.getElementById('inverse-results');
    resultsDiv.innerHTML = '';
    
    try {
        const matrix = getInverseMatrix();
        
        // Check if matrix is filled
        if (matrix.length === 0) {
            resultsDiv.innerHTML = '<div class="error">Silakan buat matriks terlebih dahulu!</div>';
            return;
        }
        
        const { inverse, steps } = inverseMatrixWithSteps(matrix);
        
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'results';
        resultsContainer.innerHTML = '<h3>Langkah-langkah perhitungan:</h3>';
        resultsContainer.appendChild(steps);
        
        const inverseDiv = document.createElement('div');
        inverseDiv.innerHTML = '<h3>Invers matriks:</h3>';
        inverseDiv.appendChild(renderBracketMatrix(inverse));
        resultsContainer.appendChild(inverseDiv);
        resultsDiv.appendChild(resultsContainer);
        
    } catch (error) {
        resultsDiv.innerHTML = `<div class="error">${error.message}</div>`;
    }
}

// ========= NOMOR 3 =========
// SPL CRAMER

function det3(m, nama, container) {
    const a = m[0][0], b = m[0][1], c = m[0][2];
    const d = m[1][0], e = m[1][1], f = m[1][2];
    const g = m[2][0], h = m[2][1], i = m[2][2];
    
    const term1 = e * i - f * h;
    const term2 = d * i - f * g;
    const term3 = d * h - e * g;
    const hasil = a * term1 - b * term2 + c * term3;

    if (container) {
        const step1 = document.createElement('div');
        step1.className = 'step';
        step1.textContent = `Det(${nama}) = ${a}(${e}×${i} − ${f}×${h}) − ${b}(${d}×${i} − ${f}×${g}) + ${c}(${d}×${h} − ${e}×${g})`;
        container.appendChild(step1);

        const step2 = document.createElement('div');
        step2.className = 'step';
        step2.textContent = `Det(${nama}) = ${hasil}`;
        container.appendChild(step2);
    }

    return hasil;
}

function renderNamedMatrix(container, label, matrix) {
    const row = document.createElement('div');
    row.className = 'cramer-matrix-row';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'cramer-matrix-label';
    labelSpan.textContent = `${label} =`;

    row.appendChild(labelSpan);
    row.appendChild(renderBracketMatrix(matrix));
    container.appendChild(row);
}

function renderCramerRow(container, matrix, name, labelName) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'cramer-row';

    // 1. Left: Matrix Name and Original Matrix
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'cramer-matrix-container';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'cramer-label';
    labelSpan.innerHTML = `${name} = `;
    matrixContainer.appendChild(labelSpan);
    matrixContainer.appendChild(renderBracketMatrix(matrix));
    
    rowDiv.appendChild(matrixContainer);

    // 2. Middle: Determinant with Sarrus Visualization
    const sarrusContainer = document.createElement('div');
    sarrusContainer.className = 'cramer-sarrus-container';
    
    const detLabel = document.createElement('span');
    detLabel.className = 'cramer-label';
    detLabel.innerHTML = `det ${labelName} = `;
    sarrusContainer.appendChild(detLabel);

    // Construct 3x5 matrix for Sarrus: [Col1 Col2 Col3 | Col1 Col2]
    const sarrusMatrix = matrix.map(row => [...row, row[0], row[1]]);
    // Split after column index 2 (so before index 3)
    sarrusContainer.appendChild(renderBracketMatrix(sarrusMatrix, { splitAt: 3 }));
    
    rowDiv.appendChild(sarrusContainer);

    // 3. Right: Determinant Calculation Steps
    const calcContainer = document.createElement('div');
    calcContainer.className = 'cramer-calc-container';
    
    // Calculate values
    const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
    const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
    const g = matrix[2][0], h = matrix[2][1], i = matrix[2][2];
    
    // Downward diagonals (positive)
    const d1 = a * e * i;
    const d2 = b * f * g;
    const d3 = c * d * h;
    
    // Upward diagonals (negative)
    const u1 = g * e * c;
    const u2 = h * f * a;
    const u3 = i * d * b;
    
    const sumDown = d1 + d2 + d3;
    const sumUp = u1 + u2 + u3;
    const result = sumDown - sumUp;

    // Step 1: = (d1 + d2 + d3) - (u1 + u2 + u3)
    // Handle negative numbers with parentheses for clarity
    const fmt = (n) => n < 0 ? `(${n})` : n;
    
    const calcStep1 = document.createElement('div');
    calcStep1.className = 'calc-line';
    calcStep1.innerHTML = `= (${fmt(d1)} + ${fmt(d2)} + ${fmt(d3)}) - (${fmt(u1)} + ${fmt(u2)} + ${fmt(u3)})`;
    
    // Step 2: = (SumDown) - (SumUp)
    const calcStep2 = document.createElement('div');
    calcStep2.className = 'calc-line indent';
    calcStep2.innerHTML = `= (${sumDown}) - (${sumUp})`;
    
    // Step 3: = Result
    const calcStep3 = document.createElement('div');
    calcStep3.className = 'calc-line indent';
    calcStep3.innerHTML = `= <span class="calc-val result">${formatNumber(result)}</span>`;

    calcContainer.appendChild(calcStep1);
    calcContainer.appendChild(calcStep2);
    calcContainer.appendChild(calcStep3);
    
    rowDiv.appendChild(calcContainer);
    container.appendChild(rowDiv);

    return result;
}

function calculateCramer() {
    const resultsDiv = document.getElementById('cramer-results');
    resultsDiv.innerHTML = '';
    
    try {
        // Get equation coefficients
        const data = [];
        const equations = [];
        for (let i = 1; i <= 3; i++) {
            const a = parseFloat(document.getElementById(`eq${i}-a`).value) || 0;
            const b = parseFloat(document.getElementById(`eq${i}-b`).value) || 0;
            const c = parseFloat(document.getElementById(`eq${i}-c`).value) || 0;
            const d = parseFloat(document.getElementById(`eq${i}-d`).value) || 0;
            data.push([a, b, c, d]);
            
            // Format equation string
            const signB = b >= 0 ? '+' : '-';
            const signC = c >= 0 ? '+' : '-';
            equations.push(`${a}x ${signB} ${Math.abs(b)}y ${signC} ${Math.abs(c)}z = ${d}`);
        }
        
        const A = data.map(row => row.slice(0, 3));
        const B = data.map(row => [row[3]]); // Vector B
        const Ax = data.map(row => [row[3], row[1], row[2]]);
        const Ay = data.map(row => [row[0], row[3], row[2]]);
        const Az = data.map(row => [row[0], row[1], row[3]]);
        
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'cramer-notebook';

        // 1. Equations Display
        const eqSection = document.createElement('div');
        eqSection.className = 'notebook-section equations-box';
        eqSection.innerHTML = equations.map(eq => `<div>${eq}</div>`).join('');
        resultsContainer.appendChild(eqSection);

        // 2. Matrix A and B Display
        const abSection = document.createElement('div');
        abSection.className = 'notebook-section ab-row';
        
        const aContainer = document.createElement('div');
        aContainer.innerHTML = '<span class="cramer-label">A = </span>';
        aContainer.appendChild(renderBracketMatrix(A));
        abSection.appendChild(aContainer);

        const bContainer = document.createElement('div');
        bContainer.innerHTML = '<span class="cramer-label">B = </span>';
        bContainer.appendChild(renderBracketMatrix(B));
        abSection.appendChild(bContainer);
        
        resultsContainer.appendChild(abSection);

        // 3. Determinant A
        const detA = renderCramerRow(resultsContainer, A, 'A', 'A');
        
        if (Math.abs(detA) < 1e-10) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = 'Det(A) = 0 → Sistem tidak memiliki solusi tunggal';
            resultsContainer.appendChild(errorDiv);
            resultsDiv.appendChild(resultsContainer);
            return;
        }

        // 4. Determinants Ax, Ay, Az
        const detAx = renderCramerRow(resultsContainer, Ax, 'A¹', 'A¹');
        const detAy = renderCramerRow(resultsContainer, Ay, 'A²', 'A²');
        const detAz = renderCramerRow(resultsContainer, Az, 'A³', 'A³');

        // 5. Final Calculation (x, y, z)
        const x = detAx / detA;
        const y = detAy / detA;
        const z = detAz / detA;

        const finalCalc = document.createElement('div');
        finalCalc.className = 'notebook-section final-results';
        finalCalc.innerHTML = `
            <div class="result-row">
                <span>x = </span>
                <div class="fraction">
                    <span class="numerator">det A¹</span>
                    <span class="denominator">det A</span>
                </div>
                <span> = </span>
                <div class="fraction">
                    <span class="numerator">${detAx}</span>
                    <span class="denominator">${detA}</span>
                </div>
                <span> = <strong>${formatNumber(x)}</strong></span>
            </div>
            <div class="result-row">
                <span>y = </span>
                <div class="fraction">
                    <span class="numerator">det A²</span>
                    <span class="denominator">det A</span>
                </div>
                <span> = </span>
                <div class="fraction">
                    <span class="numerator">${detAy}</span>
                    <span class="denominator">${detA}</span>
                </div>
                <span> = <strong>${formatNumber(y)}</strong></span>
            </div>
            <div class="result-row">
                <span>z = </span>
                <div class="fraction">
                    <span class="numerator">det A³</span>
                    <span class="denominator">det A</span>
                </div>
                <span> = </span>
                <div class="fraction">
                    <span class="numerator">${detAz}</span>
                    <span class="denominator">${detA}</span>
                </div>
                <span> = <strong>${formatNumber(z)}</strong></span>
            </div>
        `;
        resultsContainer.appendChild(finalCalc);

        // 6. Verification
        const verifySection = document.createElement('div');
        verifySection.className = 'notebook-section verification-box';
        verifySection.innerHTML = '<h4>Buktikan:</h4>';
        
        equations.forEach((_, i) => {
            const row = data[i];
            const calc = row[0]*x + row[1]*y + row[2]*z;
            const check = Math.abs(calc - row[3]) < 1e-9;
            const signB = row[1] >= 0 ? '+' : '-';
            const signC = row[2] >= 0 ? '+' : '-';
            
            const verifyRow = document.createElement('div');
            verifyRow.className = 'verify-row';
            verifyRow.innerHTML = `
                ${row[0]}(${formatNumber(x)}) ${signB} ${Math.abs(row[1])}(${formatNumber(y)}) ${signC} ${Math.abs(row[2])}(${formatNumber(z)}) 
                = ${formatNumber(calc)} ${check ? '✅' : '❌'} (Target: ${row[3]})
            `;
            verifySection.appendChild(verifyRow);
        });
        
        resultsContainer.appendChild(verifySection);
        resultsDiv.appendChild(resultsContainer);
        
    } catch (error) {
        resultsDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        console.error(error);
    }
}

// Initialize default matrices on load
window.addEventListener('DOMContentLoaded', () => {
    createMatrixInput('A');
    createMatrixInput('B');
    createMatrixInput('C');
    createInverseMatrixInput();
});
