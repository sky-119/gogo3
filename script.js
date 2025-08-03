document.addEventListener('DOMContentLoaded', () => {
    const rouletteWheel = document.getElementById('roulette-wheel');
    const spinButton = document.getElementById('spin-button');
    const optionInputs = document.querySelectorAll('.option-input');
    const resultDisplay = document.getElementById('result-display');

    let isSpinning = false;
    let currentRotation = 0;
    let segments = [];

    // 옵션 입력란 변경 시 룰렛판 업데이트
    optionInputs.forEach(input => {
        input.addEventListener('input', updateRoulette);
    });

    // 초기 룰렛판 생성
    updateRoulette();

    function updateRoulette() {
        const options = Array.from(optionInputs)
            .map(input => input.value.trim())
            .filter(value => value !== '');

        if (options.length === 0) {
            segments = ['옵션 1', '옵션 2', '옵션 3', '옵션 4', '옵션 5']; // 기본 옵션
        } else {
            while (options.length < 5) {
                options.push(''); // 빈 옵션 채우기
            }
            segments = options;
        }

        const segmentCount = segments.length;
        const sliceAngle = 360 / segmentCount;

        // 기존 세그먼트 삭제
        rouletteWheel.innerHTML = '';

        // 새 세그먼트 생성
        segments.forEach((option, index) => {
            const segment = document.createElement('div');
            segment.classList.add('roulette-segment');
            segment.style.setProperty('--rotation-offset', index * sliceAngle);

            const segmentContent = document.createElement('div');
            segmentContent.classList.add('segment-content');

            const text = document.createElement('div');
            text.classList.add('roulette-segment-text');
            text.textContent = option || '';

            segmentContent.appendChild(text);
            segment.appendChild(segmentContent);
            rouletteWheel.appendChild(segment);
        });

        // 포인터 추가 (innerHTML을 비웠으므로 다시 추가)
        const pointer = document.createElement('div');
        pointer.classList.add('pointer');
        rouletteWheel.appendChild(pointer);
    }

    spinButton.addEventListener('click', () => {
        if (!isSpinning) {
            startSpinning();
        }
    });

    function startSpinning() {
        if (segments.every(segment => segment.trim() === '')) {
            resultDisplay.textContent = '옵션을 먼저 입력해주세요!';
            return;
        }

        isSpinning = true;
        spinButton.textContent = '돌리는 중...';
        resultDisplay.textContent = '';
        rouletteWheel.classList.remove('spinning');

        const segmentCount = segments.length;
        const rotationAmount = 360 * 10; // 기본 회전량
        const winningSegmentIndex = Math.floor(Math.random() * segmentCount);
        const winningAngle = (360 / segmentCount) * winningSegmentIndex;
        const finalRotation = rotationAmount - winningAngle;

        rouletteWheel.style.transition = 'transform 6s cubic-bezier(0.1, 0.7, 0.5, 1)';
        rouletteWheel.style.transform = `rotate(${currentRotation + finalRotation}deg)`;
        currentRotation += finalRotation;

        rouletteWheel.addEventListener('transitionend', () => {
            isSpinning = false;
            spinButton.textContent = '돌리기';
            const actualRotation = currentRotation % 360;
            const winningIndex = Math.floor((360 - actualRotation) / (360 / segmentCount)) % segmentCount;
            resultDisplay.textContent = `결과: ${segments[(winningIndex + segmentCount) % segmentCount]}`;
        }, { once: true });
    }
});
