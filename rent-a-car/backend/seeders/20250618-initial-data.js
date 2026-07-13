const now = new Date();

function dateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function daysFromNow(days) {
  const value = new Date(now);
  value.setDate(value.getDate() + days);
  return value;
}

function monthsAgo(months, dayOffset = 0) {
  const value = new Date(now.getFullYear(), now.getMonth() - months, now.getDate() + dayOffset);
  return value;
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkDelete('maintenance_alerts', null, {});
    await queryInterface.bulkDelete('bookings', null, {});
    await queryInterface.bulkDelete('customers', null, {});
    await queryInterface.bulkDelete('vehicles', null, {});

    const vehicles = [
      ['Peugeot', '308', 'AB-12-CD', 'Compacto', 4.43, 'Reservado'],
      ['Renault', 'Clio', 'EY-98-ZA', 'Citadino', 3.20, 'Disponível'],
      ['BMW', 'X3', 'MN-55-DP', 'SUV', 4.90, 'Disponível'],
      ['Ford', 'Focus', 'QR-77-ST', 'Compacto', 4.45, 'Manutenção'],
      ['Audi', 'A4', 'UV-33-WX', 'Berlina', 4.85, 'Disponível'],
      ['Volkswagen', 'Golf', 'HZ-22-KL', 'Compacto', 4.10, 'Disponível'],
      ['Toyota', 'Corolla', 'JP-19-QA', 'Berlina', 4.25, 'Reservado'],
      ['Nissan', 'Qashqai', 'KR-84-LM', 'SUV', 5.10, 'Disponível'],
      ['Citroën', 'C3', 'GT-07-PR', 'Citadino', 3.05, 'Disponível'],
      ['Mercedes', 'A180', 'FD-44-VT', 'Berlina', 5.60, 'Disponível'],
      ['Seat', 'Leon', 'SB-20-NE', 'Compacto', 4.05, 'Reservado'],
      ['Skoda', 'Octavia', 'OC-31-JD', 'Berlina', 4.70, 'Disponível'],
      ['Hyundai', 'Tucson', 'TH-75-UX', 'SUV', 5.25, 'Disponível'],
      ['Opel', 'Corsa', 'OP-18-CR', 'Citadino', 3.15, 'Reservado'],
      ['Kia', 'Sportage', 'KI-90-SP', 'SUV', 5.40, 'Disponível'],
      ['Volvo', 'XC40', 'VO-63-XL', 'SUV', 5.80, 'Manutenção'],
      ['Fiat', 'Panda', 'FI-11-PA', 'Citadino', 2.95, 'Disponível'],
      ['Porsche', 'Cayenne', 'PO-77-RS', 'Desportivo', 9.90, 'Reservado'],
      ['Mini', 'Cooper', 'MI-23-NI', 'Citadino', 4.00, 'Disponível'],
      ['Dacia', 'Duster', 'DA-56-ST', 'SUV', 4.60, 'Disponível'],
      ['Lexus', 'NX', 'LX-89-NX', 'SUV', 6.20, 'Reservado'],
      ['Mazda', '3', 'MZ-41-ZA', 'Berlina', 4.55, 'Disponível'],
      ['Alfa Romeo', 'Giulia', 'AL-64-GI', 'Desportivo', 7.15, 'Manutenção'],
      ['Honda', 'Jazz', 'HO-25-JZ', 'Citadino', 3.25, 'Disponível'],
    ];

    const vehicleRows = vehicles.map((vehicle, index) => {
      const brand = vehicle[0];
      const model = vehicle[1];
      const images = {
        'Audi': { 'A4': '/cars/AUDI A4.jpg' },
        'BMW': { 'X3': '/cars/BMW X3.jpg' },
        'Citroën': { 'C3': '/cars/Citroën C3.jpg' },
        'Mercedes': { 'A180': '/cars/Mercedes A180.jpg' },
        'Nissan': { 'Qashqai': '/cars/Nissan Qashqai.jpg' },
        'Seat': { 'Leon': '/cars/Seat Leon.jpeg' },
        'Skoda': { 'Octavia': '/cars/Skoda Octavia.jpg' },
        'Toyota': { 'Corolla': '/cars/Toyota Corolla.jpg' },
        'Volkswagen': { 'Golf': '/cars/Volkswagen Golf.jpg' },
        'Ford': { 'Focus': '/cars/ford focus.jpg' }
      };
      
      return {
        brand: brand,
        model: model,
        plate: vehicle[2],
        category: vehicle[3],
        price_per_day: vehicle[4],
        status: vehicle[5],
        image_url: images[brand] ? images[brand][model] || null : null,
        created_at: index < 3 ? daysFromNow(-index - 1) : monthsAgo(1, -index),
        updated_at: daysFromNow(-index),
      };
    });

    await queryInterface.bulkInsert('vehicles', vehicleRows, {});

    const customers = [
      ['João', 'Silva', 'joao.silva@example.com', '+351 912 345 678'],
      ['Mariana', 'Costa', 'mariana.costa@example.com', '+351 913 456 789'],
      ['Bruno', 'Ferreira', 'bruno.ferreira@example.com', '+351 914 567 890'],
      ['Ana', 'Rodrigues', 'ana.rodrigues@example.com', '+351 915 678 901'],
      ['Tiago', 'Mendes', 'tiago.mendes@example.com', '+351 916 789 012'],
    ];

    await queryInterface.bulkInsert(
      'customers',
      customers.map((customer, index) => ({
        first_name: customer[0],
        last_name: customer[1],
        email: customer[2],
        phone: customer[3],
        created_at: monthsAgo(2, index),
        updated_at: daysFromNow(-index),
      })),
      {}
    );

    const bookings = [
      ['RES-0041', 1, 1, daysFromNow(-6), daysFromNow(-3), 124.0, 'Confirmada'],
      ['RES-0040', 2, 2, daysFromNow(-8), daysFromNow(-6), 76.0, 'Pendente'],
      ['RES-0039', 3, 3, daysFromNow(-10), daysFromNow(-7), 270.0, 'Confirmada'],
      ['RES-0038', 4, 5, daysFromNow(-11), daysFromNow(-11), 90.0, 'Em curso'],
      ['RES-0037', 5, 7, daysFromNow(-15), daysFromNow(-13), 188.0, 'Cancelada'],
      ['RES-0036', 1, 8, daysFromNow(-17), daysFromNow(-14), 240.0, 'Confirmada'],
      ['RES-0035', 2, 10, daysFromNow(-19), daysFromNow(-16), 310.0, 'Em curso'],
      ['RES-0034', 3, 12, daysFromNow(-21), daysFromNow(-18), 260.0, 'Confirmada'],
      ['RES-0033', 4, 15, daysFromNow(-23), daysFromNow(-20), 405.0, 'Pendente'],
      ['RES-0032', 5, 17, daysFromNow(-25), daysFromNow(-22), 180.0, 'Pendente'],
      ['RES-0031', 1, 19, daysFromNow(-27), daysFromNow(-24), 152.0, 'Concluída'],
      ['RES-0030', 2, 20, monthsAgo(1, -8), monthsAgo(1, -5), 98.0, 'Pendente'],
      ['RES-0029', 3, 21, monthsAgo(1, -12), monthsAgo(1, -10), 220.0, 'Confirmada'],
      ['RES-0028', 4, 22, monthsAgo(1, -15), monthsAgo(1, -12), 390.0, 'Em curso'],
      ['RES-0027', 5, 23, monthsAgo(1, -18), monthsAgo(1, -14), 310.0, 'Pendente'],
      ['RES-0026', 1, 24, monthsAgo(1, -20), monthsAgo(1, -17), 455.0, 'Confirmada'],
      ['RES-0025', 2, 4, monthsAgo(1, -23), monthsAgo(1, -21), 445.0, 'Confirmada'],
    ];

    const bookingRows = bookings.map((booking, index) => ({
      reference: booking[0],
      customer_id: booking[1],
      vehicle_id: booking[2],
      start_date: dateOnly(booking[3]),
      end_date: dateOnly(booking[4]),
      total_price: booking[5],
      status: booking[6],
      created_at: index < 10 ? daysFromNow(-index - 1) : monthsAgo(1, -index),
      updated_at: daysFromNow(-index),
    }));

    await queryInterface.bulkInsert('bookings', bookingRows, {});

    const alertRows = [
      {
        vehicle_id: 4,
        type: 'Manutenção',
        description: 'Indisponível até 18 Jun 2026',
        unavailable_until: dateOnly(daysFromNow(0)),
        resolved: false,
        created_at: daysFromNow(-2),
        updated_at: daysFromNow(-1),
      },
      {
        vehicle_id: 16,
        type: 'Revisão',
        description: 'Revisão programada para a próxima semana',
        unavailable_until: dateOnly(daysFromNow(7)),
        resolved: false,
        created_at: daysFromNow(-5),
        updated_at: daysFromNow(-4),
      },
    ];

    await queryInterface.bulkInsert('maintenance_alerts', alertRows, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('maintenance_alerts', null, {});
    await queryInterface.bulkDelete('bookings', null, {});
    await queryInterface.bulkDelete('customers', null, {});
    await queryInterface.bulkDelete('vehicles', null, {});
  },
};
